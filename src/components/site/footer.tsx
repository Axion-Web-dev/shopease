"use client";

import { ShoppingBag, Mail, Instagram, Twitter, Facebook, Send, Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Navigate, View } from "@/hooks/use-route";
import { toast } from "sonner";
import { useState } from "react";

export function Footer({ navigate }: { navigate: Navigate }) {
  const [email, setEmail] = useState("");

  const go = (view: View, params?: Record<string, string | undefined>) => () => navigate(view, params);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed!", { description: "Thanks for joining the ShopEase newsletter." });
    setEmail("");
  };

  return (
    <footer className="mt-auto border-t bg-muted/30">
      {/* Feature strip */}
      <div className="border-b bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-4">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over $100" },
            { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
            { icon: ShieldCheck, title: "Secure Payment", desc: "Protected checkout" },
            { icon: Headphones, title: "24/7 Support", desc: "Dedicated help center" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <button onClick={go("home")} className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <ShoppingBag className="size-5" />
              </span>
              <span className="text-xl font-bold tracking-tight">ShopEase</span>
            </button>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Your modern destination for fashion, electronics, accessories, and home essentials.
              Curated quality, fair prices, and a checkout experience you'll actually enjoy.
            </p>
            <form onSubmit={subscribe} className="mt-6 flex max-w-sm gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-background"
              />
              <Button type="submit" size="icon">
                <Send className="size-4" />
              </Button>
            </form>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Shop</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><button onClick={go("shop")} className="hover:text-primary transition-colors">All Products</button></li>
              <li><button onClick={go("shop", { category: "fashion" })} className="hover:text-primary transition-colors">Fashion</button></li>
              <li><button onClick={go("shop", { category: "electronics" })} className="hover:text-primary transition-colors">Electronics</button></li>
              <li><button onClick={go("shop", { category: "accessories" })} className="hover:text-primary transition-colors">Accessories</button></li>
              <li><button onClick={go("shop", { category: "home" })} className="hover:text-primary transition-colors">Home</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Account</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><button onClick={go("login")} className="hover:text-primary transition-colors">Sign In</button></li>
              <li><button onClick={go("register")} className="hover:text-primary transition-colors">Create Account</button></li>
              <li><button onClick={go("orders")} className="hover:text-primary transition-colors">My Orders</button></li>
              <li><button onClick={go("cart")} className="hover:text-primary transition-colors">Cart</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><span className="flex items-center gap-2"><Mail className="size-3.5" /> support@shopease.com</span></li>
              <li className="flex gap-3 pt-2">
                <a href="#" onClick={(e) => e.preventDefault()} className="grid size-9 place-items-center rounded-lg border bg-background hover:bg-accent transition-colors"><Instagram className="size-4" /></a>
                <a href="#" onClick={(e) => e.preventDefault()} className="grid size-9 place-items-center rounded-lg border bg-background hover:bg-accent transition-colors"><Twitter className="size-4" /></a>
                <a href="#" onClick={(e) => e.preventDefault()} className="grid size-9 place-items-center rounded-lg border bg-background hover:bg-accent transition-colors"><Facebook className="size-4" /></a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Demo store for portfolio · Built with Next.js &amp; Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}
