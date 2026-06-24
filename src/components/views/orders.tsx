"use client";

import { useState } from "react";
import { Package, ChevronRight, LogIn, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrders } from "@/components/site/hooks";
import { useAuth } from "@/store/auth";
import { StatusBadge, orderStatuses } from "@/components/site/status";
import type { Navigate } from "@/hooks/use-route";
import { formatPrice, formatDate } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export function OrdersView({ navigate }: { navigate: Navigate }) {
  const { user, initialized } = useAuth();
  const [status, setStatus] = useState<string>("all");
  const { data: orders, isLoading } = useOrders(status);

  if (initialized && !user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-muted">
          <LogIn className="size-7 text-muted-foreground" />
        </span>
        <h1 className="mt-6 text-2xl font-bold">Sign in to view orders</h1>
        <p className="mt-2 text-muted-foreground">Track your purchases and order history.</p>
        <Button className="mt-6" onClick={() => navigate("login")}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track and manage your purchases</p>
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 size-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            {orderStatuses.map((s) => (
              <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => navigate("order", { id: order.id })}
              className="group block w-full overflow-hidden rounded-2xl border bg-card text-left transition-all hover:shadow-md"
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="relative size-12 overflow-hidden rounded-xl border-2 border-background bg-muted">
                        <img src={item.image} alt="" className="size-full object-cover" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="grid size-12 place-items-center rounded-xl border-2 border-background bg-muted text-xs font-medium">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{order.orderNumber}</p>
                      <StatusBadge status={order.status as OrderStatus} />
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {formatDate(order.createdAt)} · {order.items.reduce((s, i) => s + i.quantity, 0)} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-bold">{formatPrice(order.total)}</p>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
          <Package className="size-10 text-muted-foreground/50" />
          <p className="mt-4 font-semibold">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">When you place an order, it'll appear here.</p>
          <Button className="mt-4" onClick={() => navigate("shop")}>Start Shopping</Button>
        </div>
      )}
    </div>
  );
}
