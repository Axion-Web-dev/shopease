"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Package, LogOut, Loader2, Save, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/store/auth";
import { useOrders, useUpdateProfile } from "@/components/site/hooks";
import type { Navigate } from "@/hooks/use-route";
import type { User as UserType } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

export function AccountView({ navigate }: { navigate: Navigate }) {
  const { user, initialized, logout } = useAuth();
  const { data: orders } = useOrders();

  if (initialized && !user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <User className="size-12 text-muted-foreground" />
        <h1 className="mt-6 text-2xl font-bold">Sign in required</h1>
        <p className="mt-2 text-muted-foreground">Please sign in to manage your account.</p>
        <Button className="mt-6" onClick={() => navigate("login")}>Sign In</Button>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate("home");
  };

  const totalSpent = orders?.reduce((s, o) => s + o.total, 0) || 0;

  return (
    <div className="animate-fade-in-up mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-sm bg-foreground/5 text-2xl font-bold text-foreground">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="display text-3xl tracking-tight">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="size-4" /> Sign out
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-sm border bg-card p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-sm bg-foreground/5 text-foreground">
              <Package className="size-5" />
            </span>
            <div>
              <p className="font-display text-2xl">{orders?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Total orders</p>
            </div>
          </div>
        </div>
        <div className="rounded-sm border bg-card p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-sm bg-foreground/5 text-foreground">
              <Wallet className="size-5" />
            </span>
            <div>
              <p className="font-display text-2xl">{formatPrice(totalSpent)}</p>
              <p className="text-xs text-muted-foreground">Total spent</p>
            </div>
          </div>
        </div>
        <div className="rounded-sm border bg-card p-5 col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-sm bg-foreground/5 text-foreground">
              <User className="size-5" />
            </span>
            <div>
              <p className="font-display text-base capitalize">{user.role.toLowerCase()}</p>
              <p className="text-xs text-muted-foreground">Account type</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile form */}
        <div className="lg:col-span-2">
          <ProfileForm key={user.id} user={user} />
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <div className="rounded-sm border bg-card p-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-luxe text-muted-foreground">Quick Actions</h3>
            <div className="mt-3 flex flex-col gap-2">
              <Button variant="outline" className="justify-start" onClick={() => navigate("orders")}>
                <Package className="size-4" /> View my orders
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate("shop")}>
                <Package className="size-4" /> Continue shopping
              </Button>
              {user.role === "ADMIN" && (
                <Button variant="outline" className="justify-start" onClick={() => navigate("admin")}>
                  <User className="size-4" /> Admin dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileForm({ user }: { user: UserType }) {
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    country: user.country || "",
    zip: user.zip || "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    try {
      await updateProfile.mutateAsync(form);
      toast.success("Profile updated successfully");
    } catch (e: any) {
      toast.error("Update failed", { description: e.message });
    }
  };

  return (
    <div className="rounded-sm border bg-card p-6">
      <h2 className="display text-2xl font-semibold">Profile Information</h2>
      <p className="mt-1 text-sm text-muted-foreground">Update your personal details and shipping address.</p>
      <Separator className="my-5" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Full Name</Label>
          <div className="relative mt-1.5">
            <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Email (read only)</Label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={user.email} disabled className="pl-9 bg-muted/50" />
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
          <div className="relative mt-1.5">
            <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="pl-9" placeholder="+1 555 0123" />
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">ZIP / Postal</Label>
          <Input value={form.zip} onChange={(e) => set("zip", e.target.value)} placeholder="97201" className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Street Address</Label>
          <div className="relative mt-1.5">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={form.address} onChange={(e) => set("address", e.target.value)} className="pl-9" placeholder="123 Main Street" />
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">City</Label>
          <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Portland" className="mt-1.5" />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Country</Label>
          <Input value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="USA" className="mt-1.5" />
        </div>
      </div>
      <Button className="mt-6" onClick={save} disabled={updateProfile.isPending}>
        {updateProfile.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Save Changes
      </Button>
    </div>
  );
}
