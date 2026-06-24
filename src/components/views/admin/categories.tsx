"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, FolderTree, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useCategories } from "@/components/site/hooks";
import { apiFetch } from "@/lib/api";
import type { Category } from "@/lib/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function AdminCategories() {
  const { data: categories, isLoading } = useCategories();
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">{categories?.length || 0} categories</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="group overflow-hidden rounded-2xl border bg-card">
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center text-muted-foreground">
                    <FolderTree className="size-8" />
                  </div>
                )}
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="secondary" size="icon" className="size-8 bg-background/90" onClick={() => setEditing(c)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button variant="secondary" size="icon" className="size-8 bg-background/90 text-destructive" onClick={() => setDeleting(c)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{c.description || "No description"}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Package className="size-3.5" />
                  {c._count?.products || 0} products
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <FolderTree className="size-10 text-muted-foreground/50" />
          <p className="mt-4 font-semibold">No categories yet</p>
          <Button className="mt-4" onClick={() => setCreating(true)}><Plus className="size-4" /> Add category</Button>
        </div>
      )}

      {(creating || editing) && (
        <CategoryForm category={editing} onClose={() => { setCreating(false); setEditing(null); }} />
      )}

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleting?.name}&quot; will be permanently deleted. Categories with products cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <DeleteCategoryButton category={deleting} onDone={() => setDeleting(null)} />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DeleteCategoryButton({ category, onDone }: { category: Category | null; onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();
  const handle = async () => {
    if (!category) return;
    setLoading(true);
    try {
      await apiFetch(`/categories/${category.id}`, { method: "DELETE" });
      toast.success("Category deleted");
      qc.invalidateQueries({ queryKey: ["categories"] });
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

function CategoryForm({ category, onClose }: { category: Category | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
    image: category?.image || "",
  });

  const save = async () => {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setLoading(true);
    try {
      const body = { name: form.name, description: form.description || null, image: form.image || null };
      if (category) {
        await apiFetch(`/categories/${category.id}`, { method: "PUT", body: JSON.stringify(body) });
        toast.success("Category updated");
      } else {
        await apiFetch("/categories", { method: "POST", body: JSON.stringify(body) });
        toast.success("Category created");
      }
      qc.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div>
            <Label className="text-xs">Category Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" placeholder="Fashion" />
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5 min-h-[60px]" placeholder="Apparel and footwear" />
          </div>
          <div>
            <Label className="text-xs">Image URL</Label>
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="mt-1.5 font-mono text-xs" placeholder="/products/example.png" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {category ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
