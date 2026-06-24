"use client";

import { CheckCircle2, Package, Truck, Home, Clock, MapPin, CreditCard, ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/components/site/hooks";
import { StatusBadge, statusStepIndex } from "@/components/site/status";
import type { Navigate } from "@/hooks/use-route";
import { formatPrice, formatDateTime } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function OrderDetail({ navigate, params }: { navigate: Navigate; params: Record<string, string> }) {
  const { data: order, isLoading } = useOrder(params.id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-64 rounded-sm" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <p className="text-lg font-semibold">Order not found</p>
        <Button className="mt-4" onClick={() => navigate("orders")}>Back to Orders</Button>
      </div>
    );
  }

  const steps = [
    { label: "Order Placed", icon: Clock, desc: "We received your order" },
    { label: "Processing", icon: Package, desc: "Preparing your items" },
    { label: "Shipped", icon: Truck, desc: "On the way to you" },
    { label: "Delivered", icon: Home, desc: "Package arrived" },
  ];
  const currentStep = statusStepIndex(order.status as OrderStatus);
  const isCancelled = order.status === "CANCELLED";

  const copyOrderNum = () => {
    navigator.clipboard.writeText(order.orderNumber);
    toast.success("Order number copied");
  };

  return (
    <div className="animate-fade-in-up mx-auto max-w-4xl px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("orders")}>
        <ArrowLeft className="size-4" /> Back to orders
      </Button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="display text-3xl tracking-tight">Order {order.orderNumber}</h1>
            <button onClick={copyOrderNum} className="text-muted-foreground hover:text-foreground">
              <Copy className="size-4" />
            </button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status as OrderStatus} className="text-sm" />
      </div>

      {/* Tracking */}
      {!isCancelled ? (
        <div className="mt-6 rounded-sm border bg-card p-6">
          <h2 className="display mb-6 text-sm font-semibold uppercase tracking-luxe text-muted-foreground">Order Tracking</h2>
          <div className="relative">
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
            <div className="relative flex justify-between">
              {steps.map((step, i) => {
                const done = i <= currentStep;
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex flex-1 flex-col items-center text-center">
                    <div
                      className={cn(
                        "grid size-10 place-items-center rounded-full border-2 transition-all",
                        done ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-background text-muted-foreground"
                      )}
                    >
                      {done ? <CheckCircle2 className="size-5" /> : <Icon className="size-5" />}
                    </div>
                    <p className={cn("mt-2 text-xs font-medium", done ? "text-foreground" : "text-muted-foreground")}>
                      {step.label}
                    </p>
                    <p className="hidden text-[11px] text-muted-foreground sm:block">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-sm border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="font-medium text-destructive">This order was cancelled</p>
          <p className="mt-1 text-sm text-muted-foreground">If you have questions, please contact support.</p>
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {/* Items */}
        <div className="md:col-span-2">
          <div className="rounded-sm border bg-card p-6">
            <h2 className="display mb-4 text-sm font-semibold uppercase tracking-luxe text-muted-foreground">Items ({order.items.length})</h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div
                    className="size-16 shrink-0 cursor-pointer overflow-hidden rounded-sm bg-muted"
                    onClick={() => navigate("product", { id: item.productId })}
                  >
                    <img src={item.image} alt={item.productName} className="size-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="self-center text-right">
                    <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="rounded-sm border bg-card p-5">
            <h3 className="display flex items-center gap-2 text-sm font-semibold">
              <MapPin className="size-4 text-accent" /> Shipping Address
            </h3>
            <div className="mt-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{order.customerName}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.zip}</p>
              <p>{order.country}</p>
              <p className="mt-1">{order.phone}</p>
            </div>
          </div>
          <div className="rounded-sm border bg-card p-5">
            <h3 className="display flex items-center gap-2 text-sm font-semibold">
              <CreditCard className="size-4 text-accent" /> Payment
            </h3>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{order.paymentMethod === "CARD" ? "Credit Card" : "Cash on Delivery"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">{order.status === "COMPLETED" ? "Paid" : "Pending"}</span>
              </div>
            </div>
          </div>
          {order.notes && (
            <div className="rounded-sm border bg-card p-5">
              <h3 className="display text-sm font-semibold">Order Notes</h3>
              <p className="mt-2 text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
