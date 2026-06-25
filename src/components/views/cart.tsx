"use client";

import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/cart";
import type { Navigate } from "@/hooks/use-route";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { useState } from "react";

export function CartView({ navigate }: { navigate: Navigate }) {
  const { items, setQuantity, remove, subtotal, clear } = useCart();
  const [coupon, setCoupon] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const sub = subtotal();
  const shipping = sub >= 100 ? 0 : sub > 0 ? 6.99 : 0;
  const discount = appliedDiscount;
  const total = sub + shipping - discount;

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = coupon.trim().toUpperCase();
    if (code === "WELCOME10") {
      setAppliedDiscount(Math.round(sub * 0.1 * 100) / 100);
      toast.success("Coupon applied!", { description: "10% discount with WELCOME10" });
    } else if (code === "SAVE20") {
      setAppliedDiscount(Math.round(sub * 0.2 * 100) / 100);
      toast.success("Coupon applied!", { description: "20% discount with SAVE20" });
    } else {
      toast.error("Invalid coupon code", { description: "Try WELCOME10 or SAVE20" });
      setAppliedDiscount(0);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
        <span className="grid size-20 place-items-center rounded-sm bg-secondary">
          <ShoppingBag className="size-9 text-muted-foreground" />
        </span>
        <h1 className="display mt-6 text-3xl tracking-tight">Your bag is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some products to get started.</p>
        <Button size="lg" className="mt-6 rounded-none" onClick={() => navigate("shop")}>
          Continue Shopping <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-luxe text-accent">Checkout</span>
          <h1 className="display mt-2 text-4xl tracking-tight">Shopping Cart</h1>
        </div>
        <Button variant="ghost" size="sm" className="rounded-sm" onClick={() => clear()}>
          <Trash2 className="size-4" /> Clear cart
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-sm border">
            <div className="hidden bg-secondary/40 px-5 py-3 text-[11px] uppercase tracking-luxe text-muted-foreground sm:grid sm:grid-cols-12">
              <span className="col-span-6">Product</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Total</span>
            </div>
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.productId} className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-12 sm:items-center">
                  <div className="col-span-6 flex items-center gap-4">
                    <div
                      className="size-20 shrink-0 cursor-pointer overflow-hidden rounded-sm bg-secondary"
                      onClick={() => navigate("product", { id: item.slug })}
                    >
                      <img src={item.image} alt={item.name} className="size-full object-cover" />
                    </div>
                    <div>
                      <button
                        onClick={() => navigate("product", { id: item.slug })}
                        className="line-clamp-2 text-left text-sm font-medium hover:text-accent"
                      >
                        {item.name}
                      </button>
                      <button
                        onClick={() => { remove(item.productId); toast.success("Removed"); }}
                        className="mt-1 flex items-center gap-1 text-[11px] uppercase tracking-luxe text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3" /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm sm:text-left">
                    <span className="sm:hidden text-[11px] uppercase tracking-luxe text-muted-foreground">Price: </span>
                    {formatPrice(item.price)}
                  </div>
                  <div className="col-span-2 flex justify-start sm:justify-center">
                    <div className="flex items-center rounded-sm border">
                      <button
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        className="grid size-8 place-items-center text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock || 99)}
                        className="grid size-8 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 text-right text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button variant="ghost" className="mt-4 rounded-sm" onClick={() => navigate("shop")}>
            <ArrowLeft className="size-4" /> Continue Shopping
          </Button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-sm border bg-card p-6">
            <h2 className="display text-xl">Order Summary</h2>

            <form onSubmit={applyCoupon} className="mt-5">
              <Label className="text-[11px] uppercase tracking-luxe text-muted-foreground">Coupon code</Label>
              <div className="mt-2 flex gap-2">
                <div className="relative flex-1">
                  <Tag className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="WELCOME10"
                    className="h-9 w-full border-x-0 border-t-0 border-b bg-transparent pl-8 pr-3 text-sm outline-none focus:border-accent"
                  />
                </div>
                <Button type="submit" size="sm" variant="secondary" className="rounded-sm">Apply</Button>
              </div>
            </form>

            <Separator className="my-5" />
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Discount</span>
                  <span className="font-medium">−{formatPrice(discount)}</span>
                </div>
              )}
            </div>
            <Separator className="my-5" />
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-luxe text-muted-foreground">Total</span>
              <span className="display text-2xl">{formatPrice(total)}</span>
            </div>

            <Button size="lg" className="mt-5 w-full rounded-none" onClick={() => navigate("checkout")}>
              Proceed to Checkout <ArrowRight className="size-4" />
            </Button>
            <p className="mt-3 text-center text-[11px] uppercase tracking-luxe text-muted-foreground">
              Secure checkout · Account required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
