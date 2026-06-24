"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, Menu, X, User, Package, LayoutDashboard, LogOut, Heart, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useCategories } from "@/components/site/hooks";
import type { Navigate, View } from "@/hooks/use-route";
import { toast } from "sonner";

export function Header({ navigate, view }: { navigate: Navigate; view: View }) {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = useCart((s) => s.count());
  const setOpen = useCart((s) => s.setOpen);
  const { user, logout } = useAuth();
  const { categories } = useCategories();

  useEffect(() => {
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

  const navItem = (label: string, target: View, params?: Record<string, string | undefined>) => (
    <button
      onClick={() => navigate(target, params)}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        view === target ? "text-primary" : "text-foreground/70"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl transition-shadow ${scrolled ? "shadow-sm" : ""}`}>
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-1.5 overflow-hidden">
          <span className="flex items-center gap-1.5"><Truck className="size-3.5" /> Free shipping over $100</span>
          <span className="hidden sm:flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> 30-day easy returns</span>
          <span className="hidden md:flex items-center gap-1.5"><Heart className="size-3.5" /> Shop the season's favorites</span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
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
              <div className="flex items-center justify-between border-b px-4 py-4">
                <button onClick={() => { navigate("home"); setMobileOpen(false); }} className="flex items-center gap-2 font-bold text-lg">
                  <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                    <ShoppingBag className="size-4" />
                  </span>
                  ShopEase
                </button>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon"><X className="size-5" /></Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                <Button variant="ghost" className="justify-start" onClick={() => { navigate("home"); setMobileOpen(false); }}>Home</Button>
                <Button variant="ghost" className="justify-start" onClick={() => { navigate("shop"); setMobileOpen(false); }}>Shop All</Button>
                {(categories || []).map((c) => (
                  <Button key={c.id} variant="ghost" className="justify-start" onClick={() => { navigate("shop", { category: c.slug }); setMobileOpen(false); }}>
                    {c.name}
                  </Button>
                ))}
                {user && <Button variant="ghost" className="justify-start" onClick={() => { navigate("orders"); setMobileOpen(false); }}>My Orders</Button>}
                {user?.role === "ADMIN" && <Button variant="ghost" className="justify-start" onClick={() => { navigate("admin"); setMobileOpen(false); }}>Admin Dashboard</Button>}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <button onClick={() => navigate("home")} className="flex shrink-0 items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShoppingBag className="size-5" />
          </span>
          <span className="text-xl font-bold tracking-tight">ShopEase</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 ml-2">
          {navItem("Home", "home")}
          {navItem("Shop", "shop")}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary flex items-center gap-1">
                Categories
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {(categories || []).map((c) => (
                <DropdownMenuItem key={c.id} onClick={() => navigate("shop", { category: c.slug })}>
                  {c.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Search */}
        <form onSubmit={onSearch} className="ml-auto hidden flex-1 max-w-sm lg:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-9 h-10 bg-muted/50 border-transparent focus-visible:border-ring focus-visible:bg-background"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          {/* User */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="size-8 border">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("account")}>
                  <User className="mr-2 size-4" /> My Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("orders")}>
                  <Package className="mr-2 size-4" /> My Orders
                </DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("admin")}>
                      <LayoutDashboard className="mr-2 size-4" /> Admin Dashboard
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("login")} className="hidden sm:flex">
              <User className="size-4" /> Sign in
            </Button>
          )}

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => setOpen(true)}>
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <Badge className="absolute -right-0.5 -top-0.5 size-5 rounded-full p-0 text-[10px] tabular-nums bg-primary text-primary-foreground">
                {count}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile search row */}
      <form onSubmit={onSearch} className="lg:hidden border-t px-4 py-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-9 h-9 bg-muted/50 border-transparent"
          />
        </div>
      </form>
    </header>
  );
}
