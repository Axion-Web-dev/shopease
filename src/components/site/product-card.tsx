"use client";

import { ShoppingBag, Plus, Check } from "lucide-react";
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
    toast.success("Added to bag", { description: product.name });
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div onClick={go} className={cn("group cursor-pointer", className)}>
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-secondary">
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            "size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105",
            outOfStock && "opacity-70"
          )}
          loading="lazy"
        />
        {/* Sale tag — top left, minimal */}
        {discount && (
          <span className="absolute left-3 top-3 bg-background/95 px-2.5 py-1 text-[11px] font-medium tracking-wide text-foreground backdrop-blur">
            −{discount}%
          </span>
        )}
        {!discount && product.badge && (
          <span className="absolute left-3 top-3 bg-background/95 px-2.5 py-1 text-[11px] font-medium tracking-wide text-foreground backdrop-blur">
            {product.badge}
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center">
            <span className="bg-background px-4 py-1.5 text-[11px] font-medium uppercase tracking-luxe text-foreground">
              Sold out
            </span>
          </div>
        )}
        {/* Quick add — slides up on hover */}
        {!outOfStock && (
          <div className="absolute inset-x-2 bottom-2 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={quickAdd}
              className="flex w-full items-center justify-center gap-2 bg-foreground/95 py-3 text-[13px] font-medium text-background backdrop-blur transition-colors hover:bg-foreground"
            >
              {added ? (
                <><Check className="size-4" /> Added</>
              ) : (
                <><Plus className="size-4" /> Quick add</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Details — minimal, left aligned */}
      <div className="mt-3">
        <p className="text-[11px] uppercase tracking-luxe text-muted-foreground">
          {product.category?.name}
        </p>
        <h3 className="mt-1 text-[15px] font-medium leading-snug text-foreground transition-colors group-hover:text-accent">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-[15px] text-foreground">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-[13px] text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* Compact horizontal variant for cart-drawer / order rows if needed */
export function ProductCardCompact({ product, navigate }: { product: Product; navigate: Navigate }) {
  const add = useCart((s) => s.add);
  return (
    <div className="flex gap-3">
      <div
        className="size-20 shrink-0 cursor-pointer overflow-hidden rounded-sm bg-secondary"
        onClick={() => navigate("product", { id: product.slug })}
      >
        <img src={product.images[0]} alt={product.name} className="size-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col">
        <h4 className="text-sm font-medium">{product.name}</h4>
        <p className="text-sm text-foreground">{formatPrice(product.price)}</p>
        <button
          onClick={() => { add(product, 1); toast.success("Added to bag"); }}
          className="mt-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ShoppingBag className="size-3" /> Add to bag
        </button>
      </div>
    </div>
  );
}
