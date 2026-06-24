import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const product = await db.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 4,
    include: { category: true },
  });

  return NextResponse.json({
    product: { ...product, images: JSON.parse(product.images) },
    related: related.map((p) => ({ ...p, images: JSON.parse(p.images) })),
  });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const existing = await db.product.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const updated = await db.product.update({
      where: { id: existing.id },
      data: {
        name: body.name,
        description: body.description,
        longDescription: body.longDescription || null,
        price: parseFloat(body.price),
        compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
        stock: parseInt(body.stock) || 0,
        categoryId: body.categoryId,
        images: JSON.stringify(body.images || []),
        featured: !!body.featured,
        bestSeller: !!body.bestSeller,
        badge: body.badge || null,
      },
      include: { category: true },
    });
    return NextResponse.json({ product: { ...updated, images: JSON.parse(updated.images) } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const existing = await db.product.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    await db.product.delete({ where: { id: existing.id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
