"use client";

import { ArrowRight, ArrowUpRight, Star, Quote, Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/site/product-card";
import { useProducts, useCategories } from "@/components/site/hooks";
import type { Navigate } from "@/hooks/use-route";
import { formatPrice } from "@/lib/format";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function HomeView({ navigate }: { navigate: Navigate }) {
  const { data: featured } = useProducts({ featured: "true", limit: "8" });
  const { data: bestSellers } = useProducts({ bestSeller: "true", limit: "4", sort: "popular" });
  const { data: categories } = useCategories();

  const heroRef = useRef(null);
  const categoriesRef = useRef(null);
  const featuredRef = useRef(null);
  const testimonialsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const categoriesInView = useInView(categoriesRef, { once: true, margin: "-100px" });
  const featuredInView = useInView(featuredRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });

  return (
    <div>
      {/* ============ Full-bleed editorial hero ============ */}
      <section ref={heroRef} className=" relative left-1/2 right-1/2 -mx-[51vw] w-screen">
        <div className="relative h-[78vh] min-h-[555px] w-full overflow-hidden">
          <motion.img
            src="/hero.png"
            alt="ShopEase collection"
            className="size-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <div className="absolute bottom-1 left-0 right-0 top-0 px-4">
            <div className="mx-auto max-w-7xl">
              <motion.div
                className="max-w-xl rounded-lg bg-black/60 p-8 backdrop-blur-md text-white m"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.p
                  className="text-[11px] uppercase tracking-luxe text-white/90 drop-shadow-sm"
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Autumn / Winter 2026
                </motion.p>
                <motion.h1
                  className="display mt-4 text-balance text-5xl leading-[1.05] md:text-7xl drop-shadow-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Considered goods for considered living
                </motion.h1>
                <motion.p
                  className="mt-5 max-w-md text-balance text-base text-white/90 md:text-lg drop-shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  A curated edit of fashion, electronics, and home essentials —
                  designed to last, priced to be fair.
                </motion.p>
                <motion.div
                  className="mt-8 flex flex-wrap items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <Button
                    size="lg"
                    onClick={() => navigate("shop")}
                    className="h-12 rounded-none border border-white bg-white px-8 text-base text-foreground hover:bg-white/90"
                  >
                    Shop the edit
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("shop", { category: "fashion" })}
                    className="h-12 rounded-none border-white/70 bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white"
                  >
                    Fashion
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
        {/* Trust strip */}
        <motion.div
          className="border-y bg-background"
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x md:grid-cols-4">
            {[
              { icon: Truck, title: "Free shipping", desc: "On orders over $100" },
              { icon: RotateCcw, title: "30-day returns", desc: "Easy & free" },
              { icon: ShieldCheck, title: "Secure checkout", desc: "SSL encrypted" },
              { icon: Headphones, title: "24/7 support", desc: "Always here" },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-3 px-4 py-5 md:px-6">
                <f.icon className="size-5 shrink-0 text-accent" strokeWidth={1.5} />
                <div>
                  <p className="text-[13px] font-medium">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ Categories — editorial grid ============ */}
      <section ref={categoriesRef} className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <motion.div
          className="mb-10 flex items-end justify-between gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-[11px] uppercase tracking-luxe text-accent">Browse</p>
            <h2 className="display mt-2 text-3xl md:text-4xl">Shop by category</h2>
          </div>
          <button
            onClick={() => navigate("shop")}
            className="group hidden items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent sm:flex"
          >
            View all
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {(categories || []).map((c, i) => (
            <motion.button
              key={c.id}
              onClick={() => navigate("shop", { category: c.slug })}
              className="group relative overflow-hidden rounded-sm bg-secondary text-left"
              style={{ aspectRatio: i % 2 === 0 ? "3/4" : "3/4" }}
              initial={{ opacity: 0, y: 30 }}
              animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <img
                src={c.image || ""}
                alt={c.name}
                className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 text-white">
                <h3 className="font-display text-xl md:text-2xl">{c.name}</h3>
                <p className="mt-0.5 text-xs text-white/80">{c._count?.products || 0} pieces</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                  Discover <ArrowRight className="size-3" />
                </span>
              </div>
            </motion.button>
          ))}
          {!categories && Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-sm" />
          ))}
        </div>
      </section>

      {/* ============ Featured products ============ */}
      <section ref={featuredRef} className="border-y bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <motion.div
            className="mb-10 flex items-end justify-between gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="text-[11px] uppercase tracking-luxe text-accent">Handpicked</p>
              <h2 className="display mt-2 text-3xl md:text-4xl">Featured pieces</h2>
            </div>
            <button
              onClick={() => navigate("shop")}
              className="group hidden items-center gap-1.5 text-sm font-medium hover:text-accent sm:flex"
            >
              View all
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </motion.div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {(featured || []).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProductCard product={p} navigate={navigate} />
              </motion.div>
            ))}
            {!featured && Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/5] rounded-sm" />
                <Skeleton className="mt-3 h-3 w-16" />
                <Skeleton className="mt-2 h-4 w-3/4" />
                <Skeleton className="mt-1 h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Editorial split banner ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <motion.div
          className="grid items-stretch gap-0 overflow-hidden rounded-sm border md:grid-cols-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col justify-center bg-foreground p-10 text-background md:p-16">
            <p className="text-[11px] uppercase tracking-luxe text-background/60">Members get more</p>
            <h2 className="display mt-4 text-3xl leading-tight md:text-5xl">
              Join ShopEase &amp; save 20% on your first order
            </h2>
            <p className="mt-4 max-w-md text-background/75">
              Create a free account to unlock member pricing, faster checkout, and
              order tracking. No catch — just a thank you for shopping with us.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                onClick={() => navigate("register")}
                className="h-12 rounded-none bg-background px-8 text-base text-foreground hover:bg-background/90"
              >
                Create account
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
          <motion.div
            className="min-h-[300px] bg-secondary"
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src="/products/leather-travel-backpack.png"
              alt="Member benefit"
              className="size-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ============ Best sellers ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:pb-28">
        <motion.div
          className="mb-10 flex items-end justify-between gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-[11px] uppercase tracking-luxe text-accent">Loved by many</p>
            <h2 className="display mt-2 text-3xl md:text-4xl">Best sellers</h2>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {bestSellers && bestSellers.length > 0 ? (
            bestSellers.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProductCard product={p} navigate={navigate} />
              </motion.div>
            ))
          ) : (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/5] rounded-sm" />
                <Skeleton className="mt-3 h-3 w-16" />
                <Skeleton className="mt-2 h-4 w-3/4" />
                <Skeleton className="mt-1 h-4 w-20" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* ============ Testimonials ============ */}
      <section ref={testimonialsRef} className="border-t bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] uppercase tracking-luxe text-accent">In good company</p>
            <h2 className="display mt-2 text-3xl md:text-4xl">What our customers say</h2>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.figure
                key={t.name}
                className="flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-accent text-accent" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="font-display text-xl leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-muted-foreground"> · Verified buyer</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Newsletter ============ */}
      <section className="border-t">
        <motion.div
          className="mx-auto max-w-3xl px-4 py-20 text-center md:py-28"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] uppercase tracking-luxe text-accent">Newsletter</p>
          <h2 className="display mt-3 text-3xl md:text-4xl">
            Stay in the loop
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Be the first to know about new arrivals, restocks, and members-only offers.
          </p>
          <motion.form
            onSubmit={(e) => { e.preventDefault(); }}
            className="mx-auto mt-8 flex max-w-md items-center gap-2 border-b-2 border-foreground/30 pb-2 focus-within:border-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              className="h-10 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className="text-sm font-medium uppercase tracking-luxe text-foreground hover:text-accent">
              Subscribe →
            </button>
          </motion.form>
        </motion.div>
      </section>
    </div>
  );
}

const testimonials = [
  {
    name: "Sarah K.",
    quote: "The quality genuinely surprised me. Everything arrived beautifully packaged and the pieces feel built to last.",
  },
  {
    name: "Marcus T.",
    quote: "Cleanest checkout I've used on any store. Order tracking is thoughtful — it actually feels designed for humans.",
  },
  {
    name: "Elena R.",
    quote: "Bought the headphones and the leather backpack. Both premium, fairly priced. Support replied within an hour.",
  },
];
