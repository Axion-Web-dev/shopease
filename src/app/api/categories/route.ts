import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    let slug = slugify(body.name);
    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;
    const category = await db.category.create({
      data: { name: body.name, slug, description: body.description || null, image: body.image || null },
    });
    return NextResponse.json({ category });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
