"use client";

import { useState } from "react";
import { Search, Eye, Loader2, ShoppingCart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useOrders, useUpdateOrderStatus } from "@/components/site/hooks";
import { StatusBadge, orderStatuses, statusConfig } from "@/components/site/status";
import type { Navigate } from "@/hooks/use-route";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice, formatDate, formatDateTime } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AdminOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewing, setViewing] = useState<Order | null>(null);
  const { data: orders, isLoading } = useOrders(statusFilter);

  const filtered = (orders || []).filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">{orders?.length || 0} orders</p>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order #, name, email..." className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[170px]">
            <Filter className="mr-2 size-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {orderStatuses.map((s) => (
              <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <ShoppingCart className="size-10 text-muted-foreground/50" />
          <p className="mt-4 font-semibold">No orders found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Order</th>
                  <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">Customer</th>
                  <th className="hidden px-4 py-3 text-left font-medium lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-center font-medium">Items</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.orderNumber}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{o.customerName}</p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <p className="font-medium">{o.customerName}</p>
                      <p className="text-xs text-muted-foreground">{o.email}</p>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell text-muted-foreground">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3 text-center">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={o.status as OrderStatus} /></td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setViewing(o)}>
                        <Eye className="size-4" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewing && <OrderDialog order={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

function OrderDialog({ order, onClose }: { order: Order; onClose: () => void }) {
  const updateStatus = useUpdateOrderStatus();
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus);

  const save = async () => {
    try {
      await updateStatus.mutateAsync({ id: order.id, status });
      toast.success("Order status updated");
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2">
            <span>Order {order.orderNumber}</span>
            <StatusBadge status={status} />
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-5">
            {/* Customer */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <p className="text-xs font-semibold text-muted-foreground">Customer</p>
                <p className="mt-1 font-medium">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.email}</p>
                <p className="text-sm text-muted-foreground">{order.phone}</p>
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-xs font-semibold text-muted-foreground">Shipping Address</p>
                <p className="mt-1 text-sm">{order.address}</p>
                <p className="text-sm">{order.city}, {order.zip}</p>
                <p className="text-sm">{order.country}</p>
              </div>
            </div>

            {/* Items */}
            <div className="rounded-xl border">
              <div className="border-b px-4 py-2.5 text-xs font-semibold text-muted-foreground">Items ({order.items.length})</div>
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img src={item.image} alt={item.productName} className="size-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(item.price)} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-1.5 px-4 py-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span></div>
                <div className="flex justify-between font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
              </div>
            </div>

            {/* Meta */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <p className="text-xs font-semibold text-muted-foreground">Payment</p>
                <p className="mt-1 text-sm font-medium">{order.paymentMethod === "CARD" ? "Credit Card" : "Cash on Delivery"}</p>
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-xs font-semibold text-muted-foreground">Placed</p>
                <p className="mt-1 text-sm font-medium">{formatDateTime(order.createdAt)}</p>
              </div>
            </div>

            {order.notes && (
              <div className="rounded-xl border p-4">
                <p className="text-xs font-semibold text-muted-foreground">Notes</p>
                <p className="mt-1 text-sm">{order.notes}</p>
              </div>
            )}

            {/* Status update */}
            <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-semibold">Update Order Status</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {orderStatuses.map((s) => {
                  const c = statusConfig[s];
                  const active = status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-all",
                        active ? cn(c.className, "ring-2 ring-primary/30") : "bg-background hover:bg-accent"
                      )}
                    >
                      <c.icon className="size-3" />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={save} disabled={updateStatus.isPending || status === order.status}>
            {updateStatus.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Save Status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
