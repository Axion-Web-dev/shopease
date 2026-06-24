"use client";

import { Suspense } from "react";
import { useRoute } from "@/hooks/use-route";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { HomeView } from "@/components/views/home";
import { ShopView } from "@/components/views/shop";
import { ProductDetail } from "@/components/views/product-detail";
import { CartView } from "@/components/views/cart";
import { CheckoutView } from "@/components/views/checkout";
import { AuthView } from "@/components/views/auth";
import { OrdersView } from "@/components/views/orders";
import { OrderDetail } from "@/components/views/order-detail";
import { AccountView } from "@/components/views/account";
import { AdminView } from "@/components/views/admin/admin-view";
import { Skeleton } from "@/components/ui/skeleton";

function Router() {
  const { view, params, navigate } = useRoute();

  return (
    <div className="flex min-h-screen flex-col">
      <Header navigate={navigate} view={view} />
      <main className="flex-1">
        {view === "home" && <HomeView navigate={navigate} />}
        {view === "shop" && <ShopView navigate={navigate} params={params} />}
        {view === "product" && <ProductDetail navigate={navigate} params={params} />}
        {view === "cart" && <CartView navigate={navigate} />}
        {view === "checkout" && <CheckoutView navigate={navigate} />}
        {(view === "login" || view === "register") && (
          <AuthView navigate={navigate} mode={view} />
        )}
        {view === "orders" && <OrdersView navigate={navigate} />}
        {view === "order" && <OrderDetail navigate={navigate} params={params} />}
        {view === "account" && <AccountView navigate={navigate} />}
        {view === "admin" && <AdminView navigate={navigate} params={params} />}
      </main>
      <Footer navigate={navigate} />
      <CartDrawer navigate={navigate} />
    </div>
  );
}

export function AppShell() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <div className="h-16 border-b" />
          <div className="flex-1 p-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-6 h-64 w-full" />
          </div>
        </div>
      }
    >
      <Router />
    </Suspense>
  );
}
