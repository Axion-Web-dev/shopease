"use client";

import { useState } from "react";
import { Search, Mail, Phone, MapPin, Users, Wallet, Package, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/site/status";
import { useAdminCustomers } from "@/components/site/hooks";
import type { Navigate } from "@/hooks/use-route";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/format";

export function AdminCustomers({ navigate }: { navigate: Navigate }) {
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<any>(null);
  const { data: customers, isLoading } = useAdminCustomers();

  const filtered = (customers || []).filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="display text-3xl tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">{customers?.length || 0} registered customers</p>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="pl-9" />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-sm" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-sm border border-dashed py-16 text-center">
          <Users className="size-10 text-muted-foreground/50" />
          <p className="mt-4 font-semibold">No customers found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div key={c.id} className="rounded-sm border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-sm bg-foreground/5 text-lg font-bold text-foreground">
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="flex items-center gap-1 font-semibold"><Package className="size-3.5 text-muted-foreground" />{c.orderCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Spent</p>
                  <p className="flex items-center gap-1 font-semibold"><Wallet className="size-3.5 text-muted-foreground" />{formatPrice(c.totalSpent)}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                {c.phone && <p className="flex items-center gap-1.5"><Phone className="size-3" />{c.phone}</p>}
                {(c.city || c.country) && <p className="flex items-center gap-1.5"><MapPin className="size-3" />{[c.city, c.country].filter(Boolean).join(", ")}</p>}
                {c.createdAt && <p className="text-muted-foreground/70">Joined {formatDate(c.createdAt)}</p>}
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setViewing(c)}>
                <Eye className="size-4" /> View orders
              </Button>
            </div>
          ))}
        </div>
      )}

      {viewing && (
        <Dialog open onOpenChange={() => setViewing(null)}>
          <DialogContent className="max-h-[90vh] sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{viewing.name}&apos;s Orders</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              {viewing.orders.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No orders yet</p>
              ) : (
                <div className="space-y-2">
                  {viewing.orders.map((o: Order) => (
                    <button
                      key={o.id}
                      onClick={() => { setViewing(null); navigate("order", { id: o.id }); }}
                      className="flex w-full items-center gap-3 rounded-xl border p-3 text-left hover:bg-accent transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{o.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                      </div>
                      <StatusBadge status={o.status as OrderStatus} />
                      <span className="text-sm font-semibold">{formatPrice(o.total)}</span>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
