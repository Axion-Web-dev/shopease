import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: { items: true, user: { select: { name: true, email: true } } },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Customers can only view their own orders
  if (user.role !== "ADMIN" && order.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ order });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const order = await db.order.update({
      where: { id },
      data: { status: body.status },
      include: { items: true },
    });
    return NextResponse.json({ order });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
