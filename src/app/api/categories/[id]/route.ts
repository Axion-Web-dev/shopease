import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const category = await db.category.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description || null,
        image: body.image || null,
      },
    });
    return NextResponse.json({ category });
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
    const count = await db.product.count({ where: { categoryId: id } });
    if (count > 0) {
      return NextResponse.json({ error: `Cannot delete: ${count} products use this category` }, { status: 400 });
    }
    await db.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
