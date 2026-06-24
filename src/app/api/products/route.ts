import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const featured = searchParams.get("featured");
  const bestSeller = searchParams.get("bestSeller");
  const limit = searchParams.get("limit");
  const excludeId = searchParams.get("excludeId");

  const where: any = {};
  if (category && category !== "all") {
    where.category = { slug: category };
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }
  if (featured === "true") where.featured = true;
  if (bestSeller === "true") where.bestSeller = true;
  if (excludeId) where.id = { not: excludeId };

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else if (sort === "popular") orderBy = { reviewCount: "desc" };
  else if (sort === "rating") orderBy = { rating: "desc" };

  const products = await db.product.findMany({
    where,
    orderBy,
    take: limit ? parseInt(limit) : undefined,
    include: { category: true },
  });

  const result = products.map((p) => ({
    ...p,
    images: JSON.parse(p.images),
    category: p.category,
  }));

  return NextResponse.json({ products: result });
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
    // ensure unique slug
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const product = await db.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description || "",
        longDescription: body.longDescription || null,
        price: parseFloat(body.price),
        compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
        stock: parseInt(body.stock) || 0,
        categoryId: body.categoryId,
        images: JSON.stringify(body.images || []),
        rating: body.rating ? parseFloat(body.rating) : 4.5,
        reviewCount: body.reviewCount ? parseInt(body.reviewCount) : 0,
        featured: !!body.featured,
        bestSeller: !!body.bestSeller,
        badge: body.badge || null,
      },
      include: { category: true },
    });
    return NextResponse.json({ product: { ...product, images: JSON.parse(product.images) } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
