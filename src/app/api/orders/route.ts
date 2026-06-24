import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().min(1),
  })).min(1),
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  address: z.string().min(5),
  city: z.string().min(2),
  country: z.string().min(2),
  zip: z.string().min(2),
  paymentMethod: z.enum(["COD", "CARD"]),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  if (user.role === "ADMIN") {
    const orders = await db.order.findMany({
      where: status && status !== "all" ? { status } : {},
      orderBy: { createdAt: "desc" },
      include: { items: true, user: { select: { name: true, email: true } } },
    });
    return NextResponse.json({ orders });
  }

  const orders = await db.order.findMany({
    where: { userId: user.id, ...(status && status !== "all" ? { status } : {}) },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    // Fetch products and validate stock
    const products = await db.product.findMany({
      where: { id: { in: data.items.map((i) => i.productId) } },
    });

    if (products.length !== data.items.length) {
      return NextResponse.json({ error: "One or more products were not found" }, { status: 400 });
    }

    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}". Available: ${product.stock}` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const itemsData = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const image = JSON.parse(product.images)[0] || "";
      return {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        image,
      };
    });
    const subtotal = itemsData.reduce((s, it) => s + it.price * it.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 6.99;
    const total = subtotal + shipping;

    const orderNumber = `SE-${Date.now().toString().slice(-8)}`;

    // Create order + reduce stock in a transaction
    const order = await db.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId: user?.id || null,
          email: data.email,
          customerName: data.customerName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          country: data.country,
          zip: data.zip,
          status: "PENDING",
          subtotal,
          shipping,
          total,
          paymentMethod: data.paymentMethod,
          notes: data.notes || null,
          items: { create: itemsData },
        },
        include: { items: true },
      });

      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      return created;
    });

    return NextResponse.json({ order });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
