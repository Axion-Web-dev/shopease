# ShopEase — Modern E-commerce Web Store

A clean, responsive, full-stack e-commerce platform featuring product browsing, cart management, checkout, order tracking, and a complete admin dashboard.

![ShopEase Home](shopease.png)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS 4** + **shadcn/ui** (New York) |
| Database | **Prisma ORM** with **PostgreSQL** |
| State | **Zustand** (cart/auth) + **TanStack Query** (server state) |
| Charts | **Recharts** |
| Icons | **Lucide React** |
| Auth | Custom scrypt-based session authentication (signed cookies) |

## Features

### Customer Side
- **Homepage** — Hero section with CTA, featured products, categories, best sellers, testimonials, newsletter signup
- **Shop** — Product grid with category filter, price range filter, search, and sort (newest / price / popularity / rating)
- **Product Detail** — Image gallery, pricing, stock status, quantity selector, add to cart, related products
- **Cart** — Slide-out drawer and full cart page with quantity updates, item removal, subtotal calculation, and coupon codes (`WELCOME10`, `SAVE20`)
- **Checkout** — Customer details, shipping address, order summary, COD or test card payment, automatic stock reduction on order
- **Authentication** — Login and registration
- **Order History** — Order list with status filtering
- **Order Detail** — Tracking timeline, items, shipping info, payment summary
- **Account** — Profile management with shipping address

### Admin Side
- **Dashboard** — Revenue, order, product, and customer stats with a 7-day revenue chart, order-status breakdown, revenue-by-category chart, top products, and recent orders
- **Product Management** — Full CRUD with image URLs, pricing, stock levels, categories, and featured/best-seller flags
- **Category Management** — Full CRUD with image and description support
- **Order Management** — View and manage all orders, with status updates (Pending → Processing → Shipped → Completed / Cancelled)
- **Customer Management** — View registered users with order history and total spend

## Admin Access

Create an admin user through the registration flow or the seed script. Access the admin dashboard at `/?view=admin-login`.

> **Note:** Change default admin credentials and use strong passwords before deploying to production.

## Getting Started

```bash
# Install dependencies
bun install

# Set up the database
bun run db:push

# Seed demo data (20 products, 4 categories, demo users, sample orders)
bun run prisma/seed.ts

# Start the development server
bun run dev
```

Open `http://localhost:3000` in your browser.

## Business Rules

- Users can add products to cart with  logging in (cart persists in `localStorage`)
- Checkout is supported for logged-in users
- Product stock is reduced transactionally after a successful order
- Admin can update order status
- Out-of-stock products cannot be purchased
- Cart total updates automatically
- Free shipping on orders over $100

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API routes (auth, products, categories, orders, admin)
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Application entry point
│   └── globals.css         # Tailwind + theme (emerald palette)
├── components/
│   ├── app-shell.tsx       # View router (SPA navigation)
│   ├── providers.tsx       # Theme + QueryClient + auth init
│   ├── site/               # Header, footer, cart drawer, product card, hooks
│   └── views/               # All page views
│       ├── home.tsx
│       ├── shop.tsx
│       ├── product-detail.tsx
│       ├── cart.tsx
│       ├── checkout.tsx
│       ├── auth.tsx
│       ├── orders.tsx
│       ├── order-detail.tsx
│       ├── account.tsx
│       └── admin/          # Admin dashboard, products, categories, orders, customers
├── lib/                     # Database, auth, types, formatting, API utilities
├── store/                    # Zustand stores (cart, auth)
└── hooks/                     # Routing hooks (SPA router)
prisma/
├── schema.prisma            # User, Category, Product, Order, OrderItem models
└── seed.ts                  # Demo data seeder
```

##  Data

20 products across 4 categories:

- **Fashion** (5) — Denim jacket, overcoat, sneakers, t-shirt, chinos
- **Electronics** (5) — Headphones, smart watch, bluetooth speaker, keyboard, charging pad
- **Accessories** (5) — Leather backpack, sunglasses, watch, wallet, silk scarf
- **Home** (5) — Coffee mugs, candle, throw blanket, desk lamp, plant pots

## License

This project is provided as-is for use and modification.
