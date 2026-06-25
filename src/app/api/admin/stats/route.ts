import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [totalProducts, totalOrders, totalCustomers, orders, products] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { items: true } }),
    db.product.findMany({ include: { category: true, orderItems: true } }),
  ]);

  const paidRevenue = orders; // recent only for revenue snapshot
  const allOrders = await db.order.findMany({ where: { status: { not: "CANCELLED" } } });
  const revenue = allOrders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = await db.order.count({ where: { status: "PENDING" } });
  const lowStock = products.filter((p) => p.stock <= 15).length;

  // Revenue by day (last 7 days)
  const now = new Date();
  const days: { label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const dayOrders = allOrders.filter((o) => o.createdAt >= d && o.createdAt < next);
    const value = dayOrders.reduce((s, o) => s + o.total, 0);
    days.push({ label: d.toLocaleDateString("en-US", { weekday: "short" }), value: Math.round(value) });
  }

  // Orders by status
  const statuses = ["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"] as const;
  const byStatus = await Promise.all(
    statuses.map(async (s) => ({ status: s, count: await db.order.count({ where: { status: s } }) }))
  );

  // Revenue by category
  const categories = await db.category.findMany({ include: { products: { include: { orderItems: true } } } });
  const byCategory = categories.map((c) => {
    const value = c.products.reduce(
      (s, p) => s + p.orderItems.reduce((ss, oi) => ss + oi.price * oi.quantity, 0),
      0
    );
    return { name: c.name, value: Math.round(value) };
  });

  // Top products by sales
  const topProducts = products
    .map((p) => {
      const sold = p.orderItems?.length
        ? p.orderItems.reduce((s, oi) => s + oi.quantity, 0)
        : 0;
      // fallback to reviewCount if no order items
      const revenue = p.orderItems?.length
        ? p.orderItems.reduce((s, oi) => s + oi.price * oi.quantity, 0)
        : 0;
      return { id: p.id, name: p.name, price: p.price, stock: p.stock, sold, revenue: Math.round(revenue) };
    })
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  // Note: orderItems relation loaded above for topProducts/revenue
  const productsWithItems = await db.product.findMany({
    include: { orderItems: true, category: true },
    take: 100,
  });
  const topProductsFull = productsWithItems
    .map((p) => {
      const sold = p.orderItems.reduce((s, oi) => s + oi.quantity, 0);
      const revenue = p.orderItems.reduce((s, oi) => s + oi.price * oi.quantity, 0);
      return { id: p.id, name: p.name, price: p.price, stock: p.stock, category: p.category.name, sold, revenue: Math.round(revenue) };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return NextResponse.json({
    totalProducts,
    totalOrders,
    totalCustomers,
    revenue: Math.round(revenue),
    pendingOrders,
    lowStock,
    recentOrders: orders,
    revenueByDay: days,
    ordersByStatus: byStatus,
    revenueByCategory: byCategory,
    topProducts: topProductsFull,
  });
}
