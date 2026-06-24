"use client";

import { ArrowRight, Star, Quote, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/site/product-card";
import { useProducts, useCategories } from "@/components/site/hooks";
import type { Navigate } from "@/hooks/use-route";
import { formatPrice } from "@/lib/format";

export function HomeView({ navigate }: { navigate: Navigate }) {
  const { data: featured } = useProducts({ featured: "true", limit: "8" });
  const { data: bestSellers } = useProducts({ bestSeller: "true", limit: "4", sort: "popular" });
  const { data: categories } = useCategories();

  return (
    <div className="animate-fade-in-up">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-background to-accent/40">
        <div className="absolute inset-0 -z-10 opacity-60">
          <div className="absolute -left-20 top-10 size-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-0 top-40 size-96 rounded-full bg-accent/50 blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="size-3.5 text-primary" /> New season collection — up to 30% off
            </span>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Style that moves <span className="text-primary">with you</span>
            </h1>
            <p className="mt-5 max-w-md text-balance text-base text-muted-foreground md:text-lg">
              Discover thoughtfully curated fashion, electronics, and home essentials.
              Premium quality, fair prices, and a checkout you&apos;ll actually enjoy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate("shop")} className="h-12 px-7 text-base">
                Shop Now <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("shop", { category: "fashion" })} className="h-12 px-7 text-base">
                Explore Fashion
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold">10k+</p>
                <p className="text-xs text-muted-foreground">Happy customers</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">4.8</p>
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-xs text-muted-foreground">Avg rating</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border bg-card shadow-xl">
              <img src="/hero.png" alt="ShopEase collection" className="aspect-[16/10] w-full object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur sm:block">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Free shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Browse by category</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Shop Categories</h2>
          </div>
          <Button variant="ghost" onClick={() => navigate("shop")} className="hidden sm:flex">
            View all <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {(categories || []).map((c) => (
            <button
              key={c.id}
              onClick={() => navigate("shop", { category: c.slug })}
              className="group relative overflow-hidden rounded-2xl border bg-card text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img src={c.image || ""} alt={c.name} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-lg font-bold">{c.name}</h3>
                <p className="text-xs text-white/80">{c._count?.products || 0} products</p>
              </div>
            </button>
          ))}
          {!categories &&
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />)}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-muted/30 border-y">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Handpicked for you</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Featured Products</h2>
            </div>
            <Button variant="ghost" onClick={() => navigate("shop")} className="hidden sm:flex">
              View all <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {(featured || []).map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
            {!featured &&
              Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground md:p-14">
          <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 -left-10 size-72 rounded-full bg-white/10 blur-2xl" />
          <div className="relative max-w-lg">
            <p className="text-sm font-medium text-primary-foreground/80">Limited time offer</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Get 20% off your first order
            </h2>
            <p className="mt-3 text-primary-foreground/80">
              Sign up today and unlock an exclusive discount on your first purchase. No catch, just savings.
            </p>
            <Button size="lg" variant="secondary" className="mt-6 h-12 px-7 text-base" onClick={() => navigate("register")}>
              Create account <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      {bestSellers && bestSellers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Customer favorites</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Best Sellers</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium text-primary">Loved by shoppers</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">What Our Customers Say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="relative rounded-2xl border bg-card p-6 shadow-sm">
                <Quote className="size-8 text-primary/20" />
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {t.name.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const testimonials = [
  {
    name: "Sarah K.",
    quote: "ShopEase has become my go-to. The quality exceeded my expectations and delivery was lightning fast. Will definitely shop again!",
  },
  {
    name: "Marcus T.",
    quote: "Clean interface, fair prices, and the checkout was genuinely the smoothest I've used. The order tracking is a nice touch.",
  },
  {
    name: "Elena R.",
    quote: "I bought the wireless headphones and the leather backpack — both premium quality. Customer support was responsive and helpful.",
  },
];
