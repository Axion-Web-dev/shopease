"use client";

import { useState } from "react";
import { Star, ShoppingBag, Minus, Plus, Check, Truck, RotateCcw, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/site/product-card";
import { useProduct } from "@/components/site/hooks";
import { useCart } from "@/store/cart";
import type { Navigate } from "@/hooks/use-route";
import { formatPrice, discountPercent } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProductDetail({ navigate, params }: { navigate: Navigate; params: Record<string, string> }) {
  const id = params.id;
  const { data, isLoading } = useProduct(id);
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-12 md:grid-cols-2">
          <Skeleton className="aspect-square rounded-sm" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.product) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
        <p className="display text-xl">Product not found</p>
        <Button className="mt-4 rounded-none" onClick={() => navigate("shop")}>Back to Shop</Button>
      </div>
    );
  }

  const { product, related } = data;
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 10;
  const discount = discountPercent(product.price, product.compareAtPrice);

  const handleAdd = () => {
    if (outOfStock) return;
    add(product, qty);
    toast.success("Added to cart", { description: `${qty} × ${product.name}` });
  };

  const buyNow = () => {
    if (outOfStock) return;
    add(product, qty);
    navigate("checkout");
  };

  return (
    <div className="animate-fade-in-up mx-auto max-w-7xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-[11px] uppercase tracking-luxe text-muted-foreground">
        <button onClick={() => navigate("home")} className="hover:text-accent">Home</button>
        <ChevronRight className="size-3.5" />
        <button onClick={() => navigate("shop", { category: product.category?.slug })} className="hover:text-accent">
          {product.category?.name || "Shop"}
        </button>
        <ChevronRight className="size-3.5" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-12 md:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-sm border bg-secondary">
            <img src={product.images[activeImg]} alt={product.name} className="aspect-square w-full object-cover" />
            {discount && (
              <UiBadge className="absolute left-4 top-4 rounded-none border-0 bg-background px-2.5 py-1 text-[11px] font-medium tracking-wide text-foreground">−{discount}%</UiBadge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "size-20 overflow-hidden rounded-sm border-2 bg-secondary transition-all",
                    activeImg === i ? "border-foreground" : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-luxe text-accent">
              {product.category?.name}
            </span>
            {product.badge && (
              <UiBadge variant="secondary" className="rounded-none text-[11px] uppercase tracking-luxe">{product.badge}</UiBadge>
            )}
          </div>
          <h1 className="display mt-3 text-4xl tracking-tight">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-4",
                    i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="display text-3xl">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {discount && (
              <span className="text-[11px] uppercase tracking-luxe text-accent">Save {formatPrice((product.compareAtPrice! - product.price))}</span>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Stock */}
          <div className="mt-5">
            {outOfStock ? (
              <span className="inline-flex items-center gap-1.5 border border-destructive/30 bg-destructive/5 px-3 py-1 text-[11px] uppercase tracking-luxe text-destructive">
                Out of stock
              </span>
            ) : lowStock ? (
              <span className="inline-flex items-center gap-1.5 border border-accent/30 bg-accent/5 px-3 py-1 text-[11px] uppercase tracking-luxe text-accent">
                <Check className="size-3.5" /> Only {product.stock} left
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 border border-foreground/15 px-3 py-1 text-[11px] uppercase tracking-luxe text-foreground">
                <Check className="size-3.5" /> In stock
              </span>
            )}
          </div>

          {/* Quantity + Add */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-sm border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-11 place-items-center text-muted-foreground hover:text-foreground"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-12 text-center font-semibold tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                disabled={outOfStock || qty >= (product.stock || 99)}
                className="grid size-11 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button size="lg" className="h-12 flex-1 min-w-[180px] rounded-none" onClick={handleAdd} disabled={outOfStock}>
              <ShoppingBag className="size-4" /> Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="h-12 rounded-none" onClick={buyNow} disabled={outOfStock}>
              Buy Now
            </Button>
          </div>

          <Separator className="my-8" />

          {/* Trust */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Truck, label: "Free shipping over $100" },
              { icon: RotateCcw, label: "30-day returns" },
              { icon: ShieldCheck, label: "Secure payment" },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-2 text-center">
                <span className="grid size-10 place-items-center rounded-sm bg-secondary text-foreground">
                  <t.icon className="size-4" />
                </span>
                <span className="text-xs text-muted-foreground">{t.label}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          {product.longDescription && (
            <div className="mt-8">
              <h2 className="display mb-3 text-lg">Product Details</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{product.longDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="mt-20">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-luxe text-accent">Discover</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <h2 className="display mb-8 text-2xl tracking-tight">You may also like</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
