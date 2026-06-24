"use client";

import { ShoppingBag, Star, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/cart";
import type { Product } from "@/lib/types";
import type { Navigate } from "@/hooks/use-route";
import { formatPrice, discountPercent } from "@/lib/format";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  navigate,
  className,
}: {
  product: Product;
  navigate: Navigate;
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;
  const discount = discountPercent(product.price, product.compareAtPrice);

  const go = () => navigate("product", { id: product.slug });

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (outOfStock) return;
    add(product, 1);
    setAdded(true);
    toast.success("Added to cart", { description: product.name });
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={go}
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg hover:-translate-y-0.5",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            "size-full object-cover transition-transform duration-500 group-hover:scale-105",
            outOfStock && "opacity-60"
          )}
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount && <Badge className="bg-destructive text-white shadow-sm">-{discount}%</Badge>}
          {product.badge && product.badge !== "Sale" && (
            <Badge variant="secondary" className="bg-background/90 backdrop-blur shadow-sm">{product.badge}</Badge>
          )}
          {product.badge === "Sale" && !discount && (
            <Badge variant="secondary" className="bg-background/90 backdrop-blur shadow-sm">Sale</Badge>
          )}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center">
            <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
              Out of stock
            </span>
          </div>
        )}
        {/* Quick actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="icon"
            variant="secondary"
            className="size-8 rounded-full bg-background/90 backdrop-blur shadow-sm"
            onClick={(e) => { e.stopPropagation(); go(); }}
          >
            <Eye className="size-4" />
          </Button>
        </div>
        {/* Add to cart bar */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            onClick={quickAdd}
            disabled={outOfStock}
            className="w-full shadow-md"
            size="sm"
          >
            {added ? <><Check className="size-4" /> Added</> : <><ShoppingBag className="size-4" /> Add to Cart</>}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-primary">
            {product.category?.name}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
            <span className="text-muted-foreground/70">({product.reviewCount})</span>
          </span>
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
