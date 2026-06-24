"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      add: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === product.id);
        if (existing) {
          const nextQty = Math.min(existing.quantity + quantity, product.stock || 99);
          set({
            items: items.map((i) =>
              i.productId === product.id ? { ...i, quantity: nextQty } : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images[0] || "",
                stock: product.stock,
                quantity: Math.min(quantity, product.stock || 99),
              },
            ],
          });
        }
        set({ isOpen: true });
      },
      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQuantity: (productId, quantity) =>
        set({
          items: get()
            .items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock || 99)) }
                : i
            )
            .filter((i) => i.quantity > 0),
        }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    {
      name: "shopease-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
