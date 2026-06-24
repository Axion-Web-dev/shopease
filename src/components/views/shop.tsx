"use client";

import { useState, useEffect, useMemo } from "react";
import { SlidersHorizontal, Search, X, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { ProductCard } from "@/components/site/product-card";
import { useProducts, useCategories } from "@/components/site/hooks";
import type { Navigate } from "@/hooks/use-route";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ShopView({ navigate, params }: { navigate: Navigate; params: Record<string, string> }) {
  const category = params.category || "all";
  const search = params.search || "";
  const sort = params.sort || "newest";

  const [searchInput, setSearchInput] = useState(search);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [activePrice, setActivePrice] = useState<[number, number]>([0, 300]);
  const { data: categories } = useCategories();

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const query = useMemo(
    () => ({
      category: category !== "all" ? category : undefined,
      search: search || undefined,
      sort,
      minPrice: activePrice[0] > 0 ? String(activePrice[0]) : undefined,
      maxPrice: activePrice[1] < 300 ? String(activePrice[1]) : undefined,
    }),
    [category, search, sort, activePrice]
  );

  const { data: products, isLoading } = useProducts(query);

  const applySearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("shop", { category, search: searchInput.trim() || undefined, sort });
  };

  const setCategory = (slug: string) =>
    navigate("shop", { category: slug === "all" ? undefined : slug, search: search || undefined, sort });

  const setSort = (s: string) =>
    navigate("shop", { category: category !== "all" ? category : undefined, search: search || undefined, sort: s });

  const applyPrice = () => setActivePrice(priceRange);
  const resetFilters = () => {
    setPriceRange([0, 300]);
    setActivePrice([0, 300]);
    navigate("shop");
  };

  const activeCategory = categories?.find((c) => c.slug === category);

  const FilterContent = (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Categories</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setCategory("all")}
            className={cn(
              "rounded-lg px-3 py-2 text-left text-sm transition-colors",
              category === "all" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            )}
          >
            All Products
          </button>
          {(categories || []).map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.slug)}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                category === c.slug ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
            >
              {c.name}
              <span className={cn("text-xs", category === c.slug ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {c._count?.products || 0}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold">Price Range</h3>
        <div className="px-1">
          <Slider
            value={priceRange}
            onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
            min={0}
            max={300}
            step={10}
            className="my-4"
          />
          <div className="flex items-center justify-between text-sm">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
          <Button size="sm" variant="outline" className="mt-3 w-full" onClick={applyPrice}>
            Apply Price
          </Button>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full justify-start text-muted-foreground">
        <X className="size-4" /> Reset all filters
      </Button>
    </div>
  );

  return (
    <div className="animate-fade-in-up mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">
          <button onClick={() => navigate("home")} className="hover:text-primary">Home</button>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">{activeCategory ? activeCategory.name : "Shop"}</span>
        </nav>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {search ? `Results for "${search}"` : activeCategory ? activeCategory.name : "All Products"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {products ? `${products.length} ${products.length === 1 ? "product" : "products"} found` : "Loading products..."}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28">
            <form onSubmit={applySearch} className="relative mb-6">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search..."
                className="pl-9"
              />
            </form>
            {FilterContent}
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-5 flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="size-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-6">
                  <form onSubmit={applySearch} className="relative mb-6">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search..."
                      className="pl-9"
                    />
                  </form>
                  {FilterContent}
                </div>
              </SheetContent>
            </Sheet>

            <form onSubmit={applySearch} className="relative flex-1 lg:hidden">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="pl-9"
              />
            </form>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-sm text-muted-foreground sm:inline">Sort by</span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters */}
          {(category !== "all" || search || activePrice[0] > 0 || activePrice[1] < 300) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {category !== "all" && (
                <Badge onRemove={() => setCategory("all")}>{activeCategory?.name}</Badge>
              )}
              {search && (
                <Badge onRemove={() => navigate("shop", { category: category !== "all" ? category : undefined, sort })}>
                  "{search}"
                </Badge>
              )}
              {(activePrice[0] > 0 || activePrice[1] < 300) && (
                <Badge onRemove={() => { setActivePrice([0, 300]); setPriceRange([0, 300]); }}>
                  {formatPrice(activePrice[0])} – {formatPrice(activePrice[1])}
                </Badge>
              )}
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} navigate={navigate} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
              <Grid3x3 className="size-10 text-muted-foreground/50" />
              <p className="mt-4 font-semibold">No products found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Badge({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium">
      {children}
      <button onClick={onRemove} className="text-muted-foreground hover:text-foreground">
        <X className="size-3" />
      </button>
    </span>
  );
}
