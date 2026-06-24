"use client";

import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";
import { CheckCircle2, Clock, Package, Truck, XCircle, PackageCheck } from "lucide-react";

const config: Record<OrderStatus, { label: string; className: string; icon: any }> = {
  PENDING: { label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Clock },
  PROCESSING: { label: "Processing", className: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Package },
  SHIPPED: { label: "Shipped", className: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20", icon: Truck },
  COMPLETED: { label: "Completed", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", c.className, className)}>
      <Icon className="size-3" />
      {c.label}
    </span>
  );
}

export const orderStatuses: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];

export function statusStepIndex(status: OrderStatus): number {
  const map: Record<OrderStatus, number> = {
    PENDING: 0,
    PROCESSING: 1,
    SHIPPED: 2,
    COMPLETED: 3,
    CANCELLED: -1,
  };
  return map[status];
}

export { config as statusConfig };
