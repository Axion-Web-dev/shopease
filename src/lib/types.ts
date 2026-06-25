export type Role = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  zip?: string | null;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  createdAt: string;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  categoryId: string;
  category?: Category;
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestSeller: boolean;
  badge?: string | null;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  email: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zip: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  notes?: string | null;
  createdAt: string;
  items: OrderItem[];
  user?: { name: string; email: string } | null;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
}
