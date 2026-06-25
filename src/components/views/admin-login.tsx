"use client";

import { useState } from "react";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";
import type { Navigate } from "@/hooks/use-route";
import { toast } from "sonner";

export function AdminLoginView({ navigate }: { navigate: Navigate }) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      if (user.role !== "ADMIN") {
        throw new Error("Access denied. Admin access required.");
      }
      toast.success(`Welcome, ${user.name}!`);
      navigate("admin");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-md items-center px-4 py-10">
      <div className="w-full rounded-sm border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-sm bg-accent/10">
            <Shield className="size-6 text-accent" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-sm border bg-background px-3 py-1 text-[11px] uppercase tracking-luxe text-accent">
            Admin Access
          </span>
          <h1 className="display mt-4 text-3xl tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your admin credentials to access the dashboard
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Email Address</Label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shopease.com"
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Password</Label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Sign In to Admin
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <button
            onClick={() => navigate("home")}
            className="font-medium text-primary hover:underline"
          >
            ← Back to Store
          </button>
        </p>
      </div>
    </div>
  );
}
