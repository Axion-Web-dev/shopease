"use client";

import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import type { Navigate } from "@/hooks/use-route";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export function CartDrawer({ navigate }: { navigate: Navigate }) {
  const { items, isOpen, setOpen, setQuantity, remove, subtotal, count } = useCart();

  const goCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setOpen(false);
    navigate("checkout");
  };

  const goShop = () => {
    setOpen(false);
    navigate("shop");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="size-5 text-primary" />
            Your Cart
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {count()}
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-muted">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </span>
            <div>
              <p className="font-semibold">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Looks like you haven&apos;t added anything yet.
              </p>
            </div>
            <Button onClick={goShop}>Start Shopping</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-5">
              <div className="flex flex-col divide-y">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 py-4">
                    <div
                      className="size-20 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-muted"
                      onClick={() => { setOpen(false); navigate("product", { id: item.slug }); }}
                    >
                      <img src={item.image} alt={item.name} className="size-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="line-clamp-2 text-sm font-medium">{item.name}</h4>
                        <button
                          onClick={() => { remove(item.productId); toast.success("Removed from cart"); }}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-primary">{formatPrice(item.price)}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-lg border">
                          <button
                            onClick={() => setQuantity(item.productId, item.quantity - 1)}
                            className="grid size-7 place-items-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => setQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= (item.stock || 99)}
                            className="grid size-7 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t bg-muted/30 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal())}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {subtotal() >= 100 ? "🎉 You qualify for free shipping!" : `Add ${formatPrice(100 - subtotal())} for free shipping`}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button onClick={goCheckout} className="w-full" size="lg">
                  Checkout <ArrowRight className="size-4" />
                </Button>
                <Button variant="ghost" onClick={() => { setOpen(false); navigate("cart"); }} className="w-full text-sm">
                  View full cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
