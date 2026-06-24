import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      city: true,
      country: true,
      createdAt: true,
      orders: { select: { id: true, total: true, status: true, createdAt: true } },
    },
  });

  const result = customers.map((c) => {
    const totalSpent = c.orders.reduce((s, o) => s + o.total, 0);
    return { ...c, orderCount: c.orders.length, totalSpent: Math.round(totalSpent) };
  });

  return NextResponse.json({ customers: result });
}
