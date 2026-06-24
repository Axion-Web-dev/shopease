"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { Category, Product, Order, User } from "@/lib/types";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<{ categories: Category[] }>("/categories").then((r) => r.categories),
  });
}

export function useProducts(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== "all") qs.set(k, v);
  });
  const key = qs.toString();
  return useQuery({
    queryKey: ["products", key],
    queryFn: () =>
      apiFetch<{ products: Product[] }>(`/products${key ? `?${key}` : ""}`).then(
        (r) => r.products
      ),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      apiFetch<{ product: Product; related: Product[] }>(`/products/${id}`).then((r) => r),
    enabled: !!id,
  });
}

export function useOrders(status?: string) {
  const qs = status && status !== "all" ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["orders", status],
    queryFn: () => apiFetch<{ orders: Order[] }>(`/orders${qs}`).then((r) => r.orders),
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => apiFetch<{ order: Order }>(`/orders/${id}`).then((r) => r.order),
    enabled: !!id,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiFetch<any>("/admin/stats"),
    refetchInterval: 30000,
  });
}

export function useAdminCustomers() {
  return useQuery({
    queryKey: ["admin-customers"],
    queryFn: () =>
      apiFetch<{ customers: (User & { orderCount: number; totalSpent: number })[] }>(
        "/admin/customers"
      ).then((r) => r.customers),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) =>
      apiFetch<{ order: Order }>("/orders", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiFetch<{ order: Order }>(`/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) =>
      apiFetch<{ user: User }>("/auth/profile", { method: "PUT", body: JSON.stringify(body) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
