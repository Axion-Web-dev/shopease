"use client";

import { useState } from "react";
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, ArrowLeft, Store, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/store/auth";
import type { Navigate } from "@/hooks/use-route";
import { cn } from "@/lib/utils";
import { AdminDashboard } from "./dashboard";
import { AdminProducts } from "./products";
import { AdminCategories } from "./categories";
import { AdminOrders } from "./orders";
import { AdminCustomers } from "./customers";

type Section = "dashboard" | "products" | "categories" | "orders" | "customers";

const sections: { id: Section; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "customers", label: "Customers", icon: Users },
];

export function AdminView({ navigate, params }: { navigate: Navigate; params: Record<string, string> }) {
  const { user, initialized } = useAuth();
  const [section, setSection] = useState<Section>((params.section as Section) || "dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const goSection = (s: Section) => {
    setSection(s);
    navigate("admin", { section: s });
    setMobileNavOpen(false);
  };

  if (initialized && (!user || user.role !== "ADMIN")) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-destructive/10 text-destructive">
          <X className="size-8" />
        </span>
        <h1 className="display mt-6 text-3xl tracking-tight">Admin access required</h1>
        <p className="mt-2 text-muted-foreground">Sign in with an admin account to access this dashboard.</p>
        <Button className="mt-6" onClick={() => navigate("admin-login")}>Sign In as Admin</Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-64 rounded-sm" />
      </div>
    );
  }

  const NavContent = (
    <nav className="flex flex-col gap-1">
      {sections.map((s) => {
        const active = section === s.id;
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            onClick={() => goSection(s.id)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-primary text-primary-foreground shadow-sm" : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <Icon className="size-4" />
            {s.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-[calc(100vh-9rem)] bg-muted/20">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar md:block">
        <div className="sticky top-28 flex h-[calc(100vh-9rem)] flex-col p-4">
          <div className="mb-6 flex items-center gap-2 px-2">
            <span className="grid size-8 place-items-center rounded-sm bg-primary text-primary-foreground">
              <Store className="size-4" />
            </span>
            <div>
              <p className="font-display text-sm font-semibold">Admin Panel</p>
              <p className="text-xs text-muted-foreground">ShopEase</p>
            </div>
          </div>
          {NavContent}
          <div className="mt-auto">
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={() => navigate("home")}>
              <ArrowLeft className="size-4" /> Back to store
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden">
        <div className="sticky top-28 z-30 border-b bg-background px-4 py-2">
          <Button variant="outline" size="sm" onClick={() => setMobileNavOpen((o) => !o)}>
            <Menu className="size-4" /> {sections.find((s) => s.id === section)?.label}
          </Button>
        </div>
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileNavOpen(false)}>
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute left-0 top-0 h-full w-72 bg-sidebar p-4" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <p className="font-bold">Admin Panel</p>
                <Button variant="ghost" size="icon" onClick={() => setMobileNavOpen(false)}>
                  <X className="size-4" />
                </Button>
              </div>
              {NavContent}
              <Button variant="ghost" size="sm" className="mt-4 w-full justify-start text-muted-foreground" onClick={() => navigate("home")}>
                <ArrowLeft className="size-4" /> Back to store
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1 p-4 md:p-8">
        {section === "dashboard" && <AdminDashboard navigate={navigate} />}
        {section === "products" && <AdminProducts navigate={navigate} />}
        {section === "categories" && <AdminCategories />}
        {section === "orders" && <AdminOrders />}
        {section === "customers" && <AdminCustomers navigate={navigate} />}
      </div>
    </div>
  );
}
