"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: ReactNode }) {
  const fetchUser = useAuth((s) => s.fetchUser);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
