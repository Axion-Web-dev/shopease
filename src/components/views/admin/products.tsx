"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Package, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useProducts, useCategories } from "@/components/site/hooks";
import { apiFetch, ApiError } from "@/lib/api";
import type { Navigate } from "@/hooks/use-route";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export function AdminProducts({ navigate }: { navigate: Navigate }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const { data: categories } = useCategories();
  const { data: products, isLoading } = useProducts({});
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const filtered = (products || []).filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.category?.slug === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">{products?.length || 0} products in catalog</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" /> Add Product
        </Button>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {(categories || []).map((c) => (
              <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <Package className="size-10 text-muted-foreground/50" />
          <p className="mt-4 font-semibold">No products found</p>
          <Button className="mt-4" onClick={() => setCreating(true)}><Plus className="size-4" /> Add your first product</Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="hidden px-4 py-3 text-left font-medium md:table-cell">Category</th>
                  <th className="px-4 py-3 text-right font-medium">Price</th>
                  <th className="px-4 py-3 text-center font-medium">Stock</th>
                  <th className="hidden px-4 py-3 text-center font-medium lg:table-cell">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <img src={p.images[0]} alt={p.name} className="size-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <button onClick={() => navigate("product", { id: p.slug })} className="line-clamp-1 text-left font-medium hover:text-primary">
                            {p.name}
                          </button>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="size-3 fill-amber-400 text-amber-400" /> {p.rating.toFixed(1)} ({p.reviewCount})
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">{p.category?.name}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn("font-medium", p.stock === 0 ? "text-destructive" : p.stock <= 15 ? "text-amber-600" : "")}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {p.featured && <UiBadge variant="secondary" className="text-xs">Featured</UiBadge>}
                        {p.bestSeller && <UiBadge variant="secondary" className="text-xs">Best Seller</UiBadge>}
                        {!p.featured && !p.bestSeller && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(p)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleting(p)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit dialog */}
      {(creating || editing) && (
        <ProductForm
          product={editing}
          categories={categories || []}
          onClose={() => { setCreating(false); setEditing(null); }}
        />
      )}

      {/* Delete confirm */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deleting?.name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <DeleteButton product={deleting} onDone={() => setDeleting(null)} />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DeleteButton({ product, onDone }: { product: Product | null; onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();
  const handle = async () => {
    if (!product) return;
    setLoading(true);
    try {
      await apiFetch(`/products/${product.id}`, { method: "DELETE" });
      toast.success("Product deleted");
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      onDone();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AlertDialogAction onClick={handle} disabled={loading} className="bg-destructive text-white hover:bg-destructive/90">
      {loading ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
    </AlertDialogAction>
  );
}

function ProductForm({ product, categories, onClose }: { product: Product | null; categories: any[]; onClose: () => void }) {
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    longDescription: product?.longDescription || "",
    price: product?.price?.toString() || "",
    compareAtPrice: product?.compareAtPrice?.toString() || "",
    stock: product?.stock?.toString() || "0",
    categoryId: product?.categoryId || categories[0]?.id || "",
    images: product?.images?.join("\n") || "",
    featured: product?.featured || false,
    bestSeller: product?.bestSeller || false,
    badge: product?.badge || "",
  });

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim() || !form.price || !form.categoryId) {
      toast.error("Name, price, and category are required");
      return;
    }
    setLoading(true);
    try {
      const images = form.images.split("\n").map((s) => s.trim()).filter(Boolean);
      const body = {
        name: form.name,
        description: form.description,
        longDescription: form.longDescription || null,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
        stock: parseInt(form.stock) || 0,
        categoryId: form.categoryId,
        images,
        featured: form.featured,
        bestSeller: form.bestSeller,
        badge: form.badge || null,
      };
      if (product) {
        await apiFetch(`/products/${product.id}`, { method: "PUT", body: JSON.stringify(body) });
        toast.success("Product updated");
      } else {
        await apiFetch("/products", { method: "POST", body: JSON.stringify(body) });
        toast.success("Product created");
      }
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div>
            <Label className="text-xs">Product Name *</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1.5" placeholder="Wireless Headphones" />
          </div>
          <div>
            <Label className="text-xs">Short Description</Label>
            <Input value={form.description} onChange={(e) => set("description", e.target.value)} className="mt-1.5" placeholder="Premium over-ear headphones" />
          </div>
          <div>
            <Label className="text-xs">Long Description</Label>
            <Textarea value={form.longDescription} onChange={(e) => set("longDescription", e.target.value)} className="mt-1.5 min-h-[80px]" placeholder="Detailed product description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Price ($) *</Label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} className="mt-1.5" placeholder="99.99" />
            </div>
            <div>
              <Label className="text-xs">Compare-at Price ($)</Label>
              <Input type="number" step="0.01" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} className="mt-1.5" placeholder="129.99" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Stock Quantity</Label>
              <Input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} className="mt-1.5" placeholder="50" />
            </div>
            <div>
              <Label className="text-xs">Category *</Label>
              <Select value={form.categoryId} onValueChange={(v) => set("categoryId", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Badge (e.g. New, Sale)</Label>
            <Input value={form.badge} onChange={(e) => set("badge", e.target.value)} className="mt-1.5" placeholder="New" />
          </div>
          <div>
            <Label className="text-xs">Image URLs (one per line)</Label>
            <Textarea value={form.images} onChange={(e) => set("images", e.target.value)} className="mt-1.5 min-h-[60px] font-mono text-xs" placeholder="/products/my-image.png" />
            <p className="mt-1 text-xs text-muted-foreground">Use /products/... paths from the public folder.</p>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <Switch checked={form.featured} onCheckedChange={(v) => set("featured", v)} />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <Switch checked={form.bestSeller} onCheckedChange={(v) => set("bestSeller", v)} />
              <span className="text-sm">Best Seller</span>
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {product ? "Save Changes" : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
