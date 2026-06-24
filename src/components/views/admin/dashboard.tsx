"use client";

import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign, Clock, AlertTriangle, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAdminStats } from "@/components/site/hooks";
import { StatusBadge } from "@/components/site/status";
import type { Navigate } from "@/hooks/use-route";
import { formatPrice, formatDate } from "@/lib/format";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell, Legend } from "recharts";

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function AdminDashboard({ navigate }: { navigate: Navigate }) {
  const { data, isLoading } = useAdminStats();

  if (isLoading || !data) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-72 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Revenue", value: formatPrice(data.revenue), icon: DollarSign, change: "+12.5%", up: true, color: "text-emerald-600 bg-emerald-500/10" },
    { label: "Total Orders", value: data.totalOrders, icon: ShoppingCart, change: "+8.2%", up: true, color: "text-primary bg-primary/10" },
    { label: "Total Products", value: data.totalProducts, icon: Package, change: "+3.1%", up: true, color: "text-amber-600 bg-amber-500/10" },
    { label: "Customers", value: data.totalCustomers, icon: Users, change: "+5.7%", up: true, color: "text-purple-600 bg-purple-500/10" },
  ];

  const statusData = data.ordersByStatus.map((s: any) => ({ name: s.status, value: s.count }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back. Here&apos;s what&apos;s happening with your store.</p>
        </div>
        <Button onClick={() => navigate("admin", { section: "products" })}>
          Manage Products <ArrowUpRight className="size-4" />
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <span className={`grid size-10 place-items-center rounded-xl ${s.color}`}>
                  <s.icon className="size-5" />
                </span>
                <span className={`flex items-center gap-1 text-xs font-medium ${s.up ? "text-emerald-600" : "text-destructive"}`}>
                  {s.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {s.change}
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-500/15 text-amber-600">
              <Clock className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{data.pendingOrders} pending orders</p>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => navigate("admin", { section: "orders" })}>
              View
            </Button>
          </CardContent>
        </Card>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-destructive/15 text-destructive">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{data.lowStock} low-stock products</p>
              <p className="text-xs text-muted-foreground">Stock at or below 15 units</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => navigate("admin", { section: "products" })}>
              View
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Revenue (last 7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: any) => [formatPrice(v), "Revenue"]}
                />
                <Bar dataKey="value" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {statusData.map((_: any, i: number) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top products + recent orders */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topProducts.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No sales yet</p>
              ) : (
                data.topProducts.map((p: any, i: number) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category} · {p.sold} sold</p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(p.revenue)}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("admin", { section: "orders" })}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentOrders.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No orders yet</p>
              ) : (
                data.recentOrders.map((o: any) => (
                  <div key={o.id} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{o.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{o.customerName} · {formatDate(o.createdAt)}</p>
                    </div>
                    <StatusBadge status={o.status} />
                    <span className="text-sm font-semibold">{formatPrice(o.total)}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by category */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.revenueByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                formatter={(v: any) => [formatPrice(v), "Revenue"]}
              />
              <Bar dataKey="value" fill="var(--chart-2)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
