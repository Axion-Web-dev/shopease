"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export type View =
  | "home"
  | "shop"
  | "product"
  | "cart"
  | "checkout"
  | "login"
  | "register"
  | "orders"
  | "order"
  | "account"
  | "admin";

export interface Route {
  view: View;
  params: Record<string, string>;
}

export type Navigate = (view: View, params?: Record<string, string | undefined>) => void;

export function useRoute(): Route & { navigate: (view: View, params?: Record<string, string | undefined>) => void } {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const obj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  const view = (params.view as View) || "home";

  const navigate = useCallback(
    (to: View, extra?: Record<string, string | undefined>) => {
      const sp = new URLSearchParams();
      sp.set("view", to);
      if (extra) {
        Object.entries(extra).forEach(([k, v]) => {
          if (v !== undefined && v !== "") sp.set(k, v);
        });
      }
      const qs = sp.toString();
      router.push(qs ? `/?${qs}` : "/");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router]
  );

  return { view, params, navigate };
}
