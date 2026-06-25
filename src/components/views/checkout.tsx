"use client";

import { useState } from "react";
import { CreditCard, Banknote, ShieldCheck, ArrowLeft, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useCreateOrder } from "@/components/site/hooks";
import type { Navigate } from "@/hooks/use-route";
import type { User } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CheckoutView({ navigate }: { navigate: Navigate }) {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();

  const sub = subtotal();
  const shipping = sub >= 100 ? 0 : 6.99;
  const total = sub + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add items before checking out.</p>
        <Button className="mt-6" onClick={() => navigate("shop")}>Browse Products</Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Authentication Required</h1>
        <p className="mt-2 text-muted-foreground">Please sign in or create an account to checkout.</p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => navigate("login")}>Sign In</Button>
          <Button variant="outline" onClick={() => navigate("register")}>Create Account</Button>
        </div>
      </div>
    );
  }

  return (
    <CheckoutForm
      key={user.id}
      navigate={navigate}
      user={user}
      items={items}
      sub={sub}
      shipping={shipping}
      total={total}
      clear={clear}
    />
  );
}

function CheckoutForm({
  navigate,
  user,
  items,
  sub,
  shipping,
  total,
  clear,
}: {
  navigate: Navigate;
  user: User | null;
  items: ReturnType<typeof useCart.getState>["items"];
  sub: number;
  shipping: number;
  total: number;
  clear: () => void;
}) {
  const createOrder = useCreateOrder();

  const [form, setForm] = useState({
    customerName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
    zip: user?.zip || "",
    notes: "",
  });
  const [payment, setPayment] = useState("COD");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.country.trim()) e.country = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    if (payment === "CARD") {
      if (card.number.replace(/\s/g, "").length < 12) e.cardNumber = "Enter a valid card number";
      if (!card.name.trim()) e.cardName = "Required";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = "MM/YY";
      if (!/^\d{3,4}$/.test(card.cvc)) e.cvc = "3-4 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) {
      toast.error("Please complete the form", { description: "Some fields need your attention." });
      return;
    }
    try {
      const res = await createOrder.mutateAsync({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        ...form,
        paymentMethod: payment,
      });
      clear();
      toast.success("Order placed successfully!", { description: res.order.orderNumber });
      navigate("order", { id: res.order.id });
    } catch (e: any) {
      toast.error("Checkout failed", { description: e.message });
    }
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="animate-fade-in-up mx-auto max-w-7xl px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("cart")}>
        <ArrowLeft className="size-4" /> Back to cart
      </Button>
      <h1 className="display mb-8 text-4xl tracking-tight md:text-5xl">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Contact */}
          <section className="rounded-sm border bg-card p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
              <span className="grid size-6 place-items-center rounded-full bg-foreground text-xs font-bold text-background">1</span>
              <span className="display">Contact Information</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" error={errors.customerName}>
                <Input value={form.customerName} onChange={(e) => set("customerName", e.target.value)} placeholder="John Doe" />
              </Field>
              <Field label="Email" error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="john@example.com" />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555 0123" />
              </Field>
            </div>
          </section>

          {/* Shipping */}
          <section className="rounded-sm border bg-card p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
              <span className="grid size-6 place-items-center rounded-full bg-foreground text-xs font-bold text-background">2</span>
              <span className="display">Shipping Address</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Street Address" error={errors.address}>
                  <Input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="123 Main Street" />
                </Field>
              </div>
              <Field label="City" error={errors.city}>
                <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Portland" />
              </Field>
              <Field label="Country" error={errors.country}>
                <Input value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="USA" />
              </Field>
              <Field label="ZIP / Postal Code" error={errors.zip}>
                <Input value={form.zip} onChange={(e) => set("zip", e.target.value)} placeholder="97201" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Order Notes (optional)">
                  <Input value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Leave with front desk..." />
                </Field>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-sm border bg-card p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
              <span className="grid size-6 place-items-center rounded-full bg-foreground text-xs font-bold text-background">3</span>
              <span className="display">Payment Method</span>
            </h2>
            <RadioGroup value={payment} onValueChange={setPayment} className="grid gap-3">
              <label className={cn("flex cursor-pointer items-center gap-3 rounded-sm border p-4 transition-all", payment === "COD" && "border-foreground bg-foreground/5")}>
                <RadioGroupItem value="COD" />
                <Banknote className="size-5 text-accent" />
                <div>
                  <p className="text-sm font-medium">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                </div>
              </label>
              <label className={cn("flex cursor-pointer items-center gap-3 rounded-sm border p-4 transition-all", payment === "CARD" && "border-foreground bg-foreground/5")}>
                <RadioGroupItem value="CARD" />
                <CreditCard className="size-5 text-accent" />
                <div>
                  <p className="text-sm font-medium">Credit / Debit Card</p>
                  <p className="text-xs text-muted-foreground">Secure test payment (no real charge)</p>
                </div>
              </label>
            </RadioGroup>

            {payment === "CARD" && (
              <div className="mt-4 grid gap-4 rounded-sm bg-muted/40 p-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Card Number" error={errors.cardNumber}>
                    <Input
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Name on Card" error={errors.cardName}>
                    <Input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="John Doe" />
                  </Field>
                </div>
                <Field label="Expiry" error={errors.expiry}>
                  <Input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} placeholder="MM/YY" maxLength={5} />
                </Field>
                <Field label="CVC" error={errors.cvc}>
                  <Input value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "") })} placeholder="123" maxLength={4} />
                </Field>
                <p className="sm:col-span-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="size-3" /> This is a demo. No real payment is processed. Use card 4242 4242 4242 4242.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-sm border bg-card p-6">
            <h2 className="display text-lg font-semibold">Order Summary</h2>
            <div className="mt-4 max-h-72 space-y-3 overflow-y-auto scrollbar-thin pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img src={item.image} alt={item.name} className="size-full object-cover" />
                    <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.price)} each</p>
                  </div>
                  <span className="self-center text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="display text-xl">{formatPrice(total)}</span>
            </div>
            <Button
              size="lg"
              className="mt-5 w-full"
              onClick={placeOrder}
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? (
                <><Loader2 className="size-4 animate-spin" /> Placing order...</>
              ) : (
                <><Lock className="size-4" /> Place Order · {formatPrice(total)}</>
              )}
            </Button>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" /> Secure SSL encrypted checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length >= 3) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
}
