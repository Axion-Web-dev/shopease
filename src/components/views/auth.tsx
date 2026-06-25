"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Mail, Lock, User, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";
import type { Navigate, View } from "@/hooks/use-route";
import { toast } from "sonner";

export function AuthView({ navigate, mode }: { navigate: Navigate; mode: "login" | "register" }) {
  const { login, register, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [mode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        const user = await login(email, password);
        toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
        navigate("orders");
      } else {
        if (name.trim().length < 2) throw new Error("Please enter your name");
        if (password.length < 8) throw new Error("Password must be at least 8 characters");
        if (!/[a-z]/.test(password)) throw new Error("Password must contain at least one lowercase letter");
        if (!/[A-Z]/.test(password)) throw new Error("Password must contain at least one uppercase letter");
        if (!/[0-9]/.test(password)) throw new Error("Password must contain at least one number");
        if (!/[^a-zA-Z0-9]/.test(password)) throw new Error("Password must contain at least one special character");
        const user = await register(name, email, password);
        toast.success(`Account created. Welcome, ${user.name.split(" ")[0]}!`);
        navigate("home");
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
  };

  const switchMode = (m: View) => navigate(m);

  return (
    <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden lg:block">
        <div className="relative overflow-hidden rounded-sm bg-foreground p-10 text-background">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 size-72 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <img src="/loggo.png" alt="ShopEase" className="h-14 w-auto" />
            </div>
            <h2 className="display mt-10 text-3xl leading-tight md:text-4xl">
              {mode === "login" ? "Welcome back to smarter shopping" : "Join thousands of happy shoppers"}
            </h2>
            <p className="mt-3 text-background/80">
              {mode === "login"
                ? "Sign in to track orders, save favorites, and check out faster."
                : "Create an account to unlock exclusive deals and a seamless checkout experience."}
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Faster checkout with saved details",
                "Track all your orders in one place",
                "Exclusive member-only discounts",
                "Priority customer support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className="grid size-5 place-items-center rounded-full bg-white/15">
                    <Check className="size-3" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex items-center gap-6 border-t border-white/15 pt-6">
              <div><p className="font-display text-2xl">10k+</p><p className="text-xs text-background/60">Customers</p></div>
              <div><p className="font-display text-2xl">4.8★</p><p className="text-xs text-background/60">Avg rating</p></div>
              <div><p className="font-display text-2xl">500+</p><p className="text-xs text-background/60">Products</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-sm border bg-card p-8 shadow-sm">
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-sm border bg-background px-3 py-1 text-[11px] uppercase tracking-luxe text-accent">
              {mode === "login" ? "Sign in to continue" : "Create your account"}
            </span>
            <h1 className="display mt-4 text-3xl tracking-tight">
              {mode === "login" ? "Welcome back" : "Get started today"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? "Enter your credentials to access your account"
                : "Fill in your details to create a free account"}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Full Name</Label>
                <div className="relative mt-1.5">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="pl-9"
                  />
                </div>
              </div>
            )}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
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
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
              className="font-medium text-primary hover:underline"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
