"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, User, Package, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useCategories } from "@/components/site/hooks";
import type { Navigate, View } from "@/hooks/use-route";
import { toast } from "sonner";

export function Header({ navigate, view }: { navigate: Navigate; view: View }) {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const count = useCart((s) => s.count());
  const setOpen = useCart((s) => s.setOpen);
  const { user, logout } = useAuth();
  const { data: categories } = useCategories();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("shop", { search: search.trim() || undefined });
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate("home");
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl transition-shadow ${scrolled ? "shadow-sm" : ""}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:h-[68px]">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <button onClick={() => { navigate("home"); setMobileOpen(false); }}>
                  <img src="/loggo.png" alt="ShopEase" className="h-10 w-auto" />
                </button>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon"><X className="size-5" /></Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col gap-0.5 p-4">
                <button onClick={() => { navigate("home"); setMobileOpen(false); }} className="rounded-sm px-3 py-2.5 text-left text-sm font-medium hover:bg-accent/10">Home</button>
                <button onClick={() => { navigate("shop"); setMobileOpen(false); }} className="rounded-sm px-3 py-2.5 text-left text-sm font-medium hover:bg-accent/10">Shop All</button>
                <p className="px-3 pt-4 pb-1 text-[11px] uppercase tracking-luxe text-muted-foreground">Categories</p>
                {(categories || []).map((c) => (
                  <button key={c.id} className="rounded-sm px-3 py-2.5 text-left text-sm hover:bg-accent/10" onClick={() => { navigate("shop", { category: c.slug }); setMobileOpen(false); }}>
                    {c.name}
                  </button>
                ))}
                {user && <button className="mt-4 rounded-sm px-3 py-2.5 text-left text-sm font-medium hover:bg-accent/10" onClick={() => { navigate("orders"); setMobileOpen(false); }}>My Orders</button>}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <button onClick={() => navigate("home")} className="shrink-0">
          <img src="/loggo.png" alt="ShopEase" className="h-12 w-auto" />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex md:ml-4">
          <button
            onClick={() => navigate("shop")}
            className={`text-[13px] font-medium uppercase tracking-luxe transition-colors hover:text-accent ${view === "shop" ? "text-accent" : "text-foreground/80"}`}
          >
            Shop
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="flex items-center gap-1 text-[13px] font-medium uppercase tracking-luxe text-foreground/80 transition-colors hover:text-accent">
                Collections <ChevronDown className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-sm border-border/60 p-1">
              {(categories || []).map((c) => (
                <DropdownMenuItem key={c.id} onClick={() => navigate("shop", { category: c.slug })} className="rounded-sm px-3 py-2 text-sm">
                  {c.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Search */}
        <form onSubmit={onSearch} className="ml-auto hidden flex-1 max-w-xs md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="h-9 rounded-none border-transparent bg-muted/50 pl-9 text-sm focus-visible:border-foreground focus-visible:bg-background"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-transparent text-xs font-medium text-foreground">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-sm border-border/60 p-1">
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-sm" onClick={() => navigate("account")}>
                  <User className="mr-2 size-4" /> My Account
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-sm" onClick={() => navigate("orders")}>
                  <Package className="mr-2 size-4" /> My Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-sm text-destructive focus:text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("login")} className="hidden text-[13px] font-medium uppercase tracking-luxe sm:flex">
              Sign in
            </Button>
          )}

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => setOpen(true)}>
            <ShoppingBag className="size-5" strokeWidth={1.5} />
            {mounted && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={onSearch} className="border-t border-border/60 px-4 py-2 lg:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="h-9 rounded-none border-transparent bg-muted/50 pl-9 text-sm"
          />
        </div>
      </form>
    </header>
  );
}
