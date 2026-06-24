"use client";

import { ShoppingBag, Mail, Instagram, Twitter, Facebook, Send, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Navigate, View } from "@/hooks/use-route";
import { toast } from "sonner";
import { useState } from "react";

export function Footer({ navigate }: { navigate: Navigate }) {
  const [email, setEmail] = useState("");
  const go = (view: View, params?: Record<string, string | undefined>) => () => navigate(view, params);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed!", { description: "Welcome to the ShopEase list." });
    setEmail("");
  };

  return (
    <footer className="mt-auto border-t bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <button onClick={go("home")} className="flex items-center">
              <span className="font-display text-3xl tracking-tight">ShopEase</span>
            </button>
            <p className="mt-4 max-w-sm text-sm text-background/70">
              A modern destination for considered goods. Curated quality, fair prices,
              and an experience built to be enjoyed.
            </p>
            <form onSubmit={subscribe} className="mt-6 flex max-w-sm items-center gap-2 border-b border-background/30 pb-2 focus-within:border-background">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email for newsletter"
                className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-background/50"
              />
              <button type="submit" className="text-background hover:text-accent">
                <Send className="size-4" />
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-luxe text-background/50">Shop</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><button onClick={go("shop")} className="text-background/80 hover:text-accent">All Products</button></li>
              <li><button onClick={go("shop", { category: "fashion" })} className="text-background/80 hover:text-accent">Fashion</button></li>
              <li><button onClick={go("shop", { category: "electronics" })} className="text-background/80 hover:text-accent">Electronics</button></li>
              <li><button onClick={go("shop", { category: "accessories" })} className="text-background/80 hover:text-accent">Accessories</button></li>
              <li><button onClick={go("shop", { category: "home" })} className="text-background/80 hover:text-accent">Home</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-luxe text-background/50">Account</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><button onClick={go("login")} className="text-background/80 hover:text-accent">Sign In</button></li>
              <li><button onClick={go("register")} className="text-background/80 hover:text-accent">Create Account</button></li>
              <li><button onClick={go("orders")} className="text-background/80 hover:text-accent">My Orders</button></li>
              <li><button onClick={go("cart")} className="text-background/80 hover:text-accent">Cart</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-luxe text-background/50">Connect</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><span className="flex items-center gap-2 text-background/80"><Mail className="size-4" /> support@shopease.com</span></li>
              <li className="flex gap-2 pt-1">
                <a href="#" onClick={(e) => e.preventDefault()} className="grid size-9 place-items-center rounded-sm border border-background/20 hover:bg-background/10 hover:text-accent transition-colors"><Instagram className="size-4" /></a>
                <a href="#" onClick={(e) => e.preventDefault()} className="grid size-9 place-items-center rounded-sm border border-background/20 hover:bg-background/10 hover:text-accent transition-colors"><Twitter className="size-4" /></a>
                <a href="#" onClick={(e) => e.preventDefault()} className="grid size-9 place-items-center rounded-sm border border-background/20 hover:bg-background/10 hover:text-accent transition-colors"><Facebook className="size-4" /></a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-background/15 pt-6 text-xs text-background/60 sm:flex-row">
          <p>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted as a portfolio demo
            <ArrowUpRight className="size-3" />
          </p>
        </div>
      </div>
    </footer>
  );
}
