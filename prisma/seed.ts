import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type SeedProduct = {
  name: string;
  description: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  bestSeller?: boolean;
  badge?: string;
};

const products: SeedProduct[] = [
  // ---------------- Fashion ----------------
  {
    name: "Classic Denim Jacket",
    description: "Timeless mid-wash denim jacket with a relaxed fit and brass buttons.",
    longDescription:
      "A wardrobe staple reimagined. Cut from 100% organic cotton denim with a mid-wash finish, this jacket features a classic point collar, button-front closure, and two chest pockets. The relaxed fit layers effortlessly over tees and knits for year-round wear.",
    price: 89.99,
    compareAtPrice: 119.99,
    stock: 42,
    category: "fashion",
    image: "/products/classic-denim-jacket.png",
    rating: 4.7,
    reviewCount: 128,
    featured: true,
    bestSeller: true,
    badge: "Sale",
  },
  {
    name: "Wool Blend Overcoat",
    description: "Elegant camel overcoat tailored from a soft wool blend for cold-weather polish.",
    longDescription:
      "Refined tailoring meets everyday warmth. This single-breasted overcoat is crafted from a premium wool blend with a notched lapel and clean lines. Fully lined for a smooth drape, it's the finishing layer your cold-weather wardrobe has been missing.",
    price: 199.99,
    compareAtPrice: 249.99,
    stock: 18,
    category: "fashion",
    image: "/products/wool-blend-overcoat.png",
    rating: 4.9,
    reviewCount: 64,
    featured: true,
    badge: "Sale",
  },
  {
    name: "Minimalist White Sneakers",
    description: "Clean leather sneakers with a cushioned insole for all-day comfort.",
    longDescription:
      "Less, but better. These minimalist sneakers are constructed from full-grain leather with a subtle perforated detail and a memory-foam insole. The flexible rubber outsole delivers traction without bulk, making them the go-anywhere pair you'll reach for daily.",
    price: 74.99,
    stock: 67,
    category: "fashion",
    image: "/products/minimalist-white-sneakers.png",
    rating: 4.6,
    reviewCount: 213,
    bestSeller: true,
    badge: "New",
  },
  {
    name: "Cotton Crewneck T-Shirt",
    description: "Soft combed-cotton tee with a perfect everyday fit.",
    longDescription:
      "The essential tee, perfected. Spun from combed ring-spun cotton with a pre-shrunk finish, this crewneck offers a soft hand feel and a flattering regular fit. Side seams keep its shape wash after wash.",
    price: 24.99,
    compareAtPrice: 32.0,
    stock: 150,
    category: "fashion",
    image: "/products/cotton-crewneck-tshirt.png",
    rating: 4.5,
    reviewCount: 340,
    bestSeller: true,
  },
  {
    name: "Tailored Chino Pants",
    description: "Versatile stretch-cotton chinos with a slim, tapered leg.",
    longDescription:
      "Smart-casual done right. These chinos are woven with a touch of stretch for all-day ease, with a slim tapered leg and a clean flat front. Dress them up with an Oxford shirt or down with a favorite tee.",
    price: 59.99,
    stock: 80,
    category: "fashion",
    image: "/products/tailored-chino-pants.png",
    rating: 4.4,
    reviewCount: 96,
  },

  // ---------------- Electronics ----------------
  {
    name: "Wireless Noise-Cancel Headphones",
    description: "Over-ear headphones with active noise cancellation and 40h battery.",
    longDescription:
      "Immerse yourself in pure sound. Hybrid active noise cancellation blocks up to 90% of ambient noise, while 40mm drivers deliver rich, balanced audio. With 40 hours of playtime and a fast-charge feature, you get 5 hours from a 10-minute charge.",
    price: 249.99,
    compareAtPrice: 299.99,
    stock: 35,
    category: "electronics",
    image: "/products/wireless-headphones.png",
    rating: 4.8,
    reviewCount: 412,
    featured: true,
    bestSeller: true,
    badge: "Sale",
  },
  {
    name: "Smart Fitness Watch",
    description: "Health tracking, GPS, and a vivid AMOLED display on your wrist.",
    longDescription:
      "Your wellness companion. Track heart rate, sleep, SpO2, and 100+ workout modes with built-in GPS. The 1.43-inch AMOLED display stays readable in sunlight, and a 10-day battery life keeps you going without daily charging.",
    price: 129.99,
    compareAtPrice: 159.99,
    stock: 54,
    category: "electronics",
    image: "/products/smart-fitness-watch.png",
    rating: 4.6,
    reviewCount: 287,
    featured: true,
    badge: "New",
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Compact speaker with 360° sound and IPX7 waterproofing.",
    longDescription:
      "Big sound, small package. This portable speaker pumps out 360° audio with deep bass from a passive radiator. IPX7 waterproofing means it survives pool parties and beach trips, and 24 hours of playtime keeps the music going all day.",
    price: 69.99,
    stock: 72,
    category: "electronics",
    image: "/products/bluetooth-speaker.png",
    rating: 4.5,
    reviewCount: 198,
    bestSeller: true,
  },
  {
    name: "Mechanical Keyboard",
    description: "75% layout keyboard with hot-swappable brown switches.",
    longDescription:
      "Type with satisfaction. This compact 75% mechanical keyboard features tactile brown switches, hot-swappable sockets, and PBT keycaps for a premium feel. Connect via USB-C or Bluetooth to three devices, with a 4000mAh battery for wireless freedom.",
    price: 119.99,
    compareAtPrice: 139.99,
    stock: 28,
    category: "electronics",
    image: "/products/mechanical-keyboard.png",
    rating: 4.7,
    reviewCount: 156,
    badge: "Sale",
  },
  {
    name: "Wireless Charging Pad",
    description: "Sleek 15W fast charger compatible with Qi-enabled devices.",
    longDescription:
      "Drop and charge. This 15W wireless pad charges Qi-compatible phones, earbuds, and more at full speed. A slim profile and anti-slip surface keep your desk tidy, and intelligent temperature control protects your device.",
    price: 39.99,
    stock: 110,
    category: "electronics",
    image: "/products/wireless-charging-pad.png",
    rating: 4.3,
    reviewCount: 142,
  },

  // ---------------- Accessories ----------------
  {
    name: "Leather Travel Backpack",
    description: "Full-grain leather backpack with a padded 15\" laptop sleeve.",
    longDescription:
      "Crafted for the journey. Made from full-grain leather that develops a rich patina over time, this backpack features a padded 15-inch laptop compartment, hidden anti-theft pocket, and roll-top closure for expandable capacity. Carry it for work or weekend escapes.",
    price: 129.99,
    compareAtPrice: 169.99,
    stock: 24,
    category: "accessories",
    image: "/products/leather-travel-backpack.png",
    rating: 4.8,
    reviewCount: 89,
    featured: true,
    bestSeller: true,
    badge: "Sale",
  },
  {
    name: "Aviator Sunglasses",
    description: "Classic aviators with UV400 protection and a lightweight frame.",
    longDescription:
      "Iconic style, modern comfort. These aviator sunglasses feature a durable gold-tone metal frame, green-tinted polarized lenses with full UV400 protection, and adjustable nose pads for a custom fit. Includes a hard case and microfiber pouch.",
    price: 89.99,
    stock: 60,
    category: "accessories",
    image: "/products/aviator-sunglasses.png",
    rating: 4.5,
    reviewCount: 134,
  },
  {
    name: "Stainless Steel Watch",
    description: "Minimalist analog watch with sapphire crystal and 5ATM water resistance.",
    longDescription:
      "Understated elegance. A clean white dial, slim hands, and a brushed stainless steel bracelet make this watch a versatile daily piece. Sapphire crystal resists scratches, and 5ATM water resistance handles hand washing and rain with ease.",
    price: 159.99,
    compareAtPrice: 199.99,
    stock: 33,
    category: "accessories",
    image: "/products/stainless-steel-watch.png",
    rating: 4.7,
    reviewCount: 78,
    featured: true,
    badge: "Sale",
  },
  {
    name: "Minimalist Leather Wallet",
    description: "Slim bifold wallet in full-grain leather with RFID blocking.",
    longDescription:
      "Carry only what matters. This slim bifold wallet holds up to 8 cards with RFID-blocking protection and a full-length cash pocket. Full-grain leather ages beautifully, developing a unique character with everyday use.",
    price: 49.99,
    stock: 95,
    category: "accessories",
    image: "/products/leather-wallet.png",
    rating: 4.6,
    reviewCount: 167,
    bestSeller: true,
  },
  {
    name: "Silk Scarf",
    description: "Luxurious silk scarf with an exclusive floral print.",
    longDescription:
      "A pop of artistry. Woven from 100% mulberry silk, this scarf features a hand-illustrated floral print in warm, earthy tones. Generously sized for styling versatility—wear it around the neck, as a headband, or tied to your bag.",
    price: 34.99,
    compareAtPrice: 44.99,
    stock: 48,
    category: "accessories",
    image: "/products/silk-scarf.png",
    rating: 4.4,
    reviewCount: 52,
    badge: "New",
  },

  // ---------------- Home ----------------
  {
    name: "Ceramic Coffee Mug Set",
    description: "Set of 2 matte-glaze stoneware mugs in warm earthy tones.",
    longDescription:
      "Slow mornings, made better. This set of two 350ml stoneware mugs features a reactive matte glaze in terracotta and cream, each piece subtly unique. Microwave and dishwasher safe, with a comfortable loop handle.",
    price: 29.99,
    stock: 120,
    category: "home",
    image: "/products/ceramic-coffee-mug-set.png",
    rating: 4.6,
    reviewCount: 143,
    featured: true,
    bestSeller: true,
  },
  {
    name: "Scented Soy Candle",
    description: "Hand-poured soy candle with cedar & vanilla, 45h burn time.",
    longDescription:
      "Set the mood. Hand-poured from natural soy wax with a cotton wick, this candle blends warm cedar and creamy vanilla for a grounding aroma. The 45-hour burn time and reusable glass jar with wooden lid make it a gift-ready favorite.",
    price: 19.99,
    compareAtPrice: 26.99,
    stock: 140,
    category: "home",
    image: "/products/scented-soy-candle.png",
    rating: 4.7,
    reviewCount: 211,
    bestSeller: true,
    badge: "Sale",
  },
  {
    name: "Linen Throw Blanket",
    description: "Breathable pre-washed linen throw in a warm neutral tone.",
    longDescription:
      "Cozy texture, effortless style. Woven from pure pre-washed linen, this throw softens with every wash. Drape it over the sofa or the foot of the bed for an instant layer of warmth and understated texture. 130x170cm.",
    price: 59.99,
    stock: 56,
    category: "home",
    image: "/products/linen-throw-blanket.png",
    rating: 4.5,
    reviewCount: 87,
    featured: true,
  },
  {
    name: "Modern Desk Lamp",
    description: "LED desk lamp with 3 color modes and touch dimming.",
    longDescription:
      "Light, your way. This energy-efficient LED lamp offers three color temperatures and stepless touch dimming to suit any task. The minimalist matte finish and adjustable arm fit any workspace, and a USB port keeps your phone charged.",
    price: 79.99,
    compareAtPrice: 99.99,
    stock: 41,
    category: "home",
    image: "/products/modern-desk-lamp.png",
    rating: 4.6,
    reviewCount: 104,
    badge: "Sale",
  },
  {
    name: "Indoor Plant Pot Set",
    description: "Set of 3 ceramic pots with drainage and bamboo trays.",
    longDescription:
      "Bring the outside in. This set of three ceramic pots in graduated sizes includes drainage holes and matching bamboo saucers to keep surfaces clean. A soft matte glaze pairs with any greenery. Plants not included.",
    price: 39.99,
    stock: 73,
    category: "home",
    image: "/products/indoor-plant-pot-set.png",
    rating: 4.4,
    reviewCount: 69,
    badge: "New",
  },
];

const categories = [
  { name: "Fashion", slug: "fashion", description: "Apparel and footwear for everyday style.", image: "/products/classic-denim-jacket.png" },
  { name: "Electronics", slug: "electronics", description: "Gadgets and gear for a connected life.", image: "/products/wireless-headphones.png" },
  { name: "Accessories", slug: "accessories", description: "Bags, watches, and finishing touches.", image: "/products/leather-travel-backpack.png" },
  { name: "Home", slug: "home", description: "Cozy decor and everyday essentials.", image: "/products/ceramic-coffee-mug-set.png" },
];

async function main() {
  console.log("Seeding database...");

  // Users - only create admin account (no demo customer)
  const adminPass = await hashPassword("admin123");
  const admin = await db.user.upsert({
    where: { email: "admin@shopease.com" },
    update: { password: adminPass, role: "ADMIN" },
    create: { email: "admin@shopease.com", name: "Store Admin", password: adminPass, role: "ADMIN" },
  });
  console.log(`Admin account: ${admin.email}`);

  // Delete in correct order due to foreign key constraints
  await db.orderItem.deleteMany({});
  await db.order.deleteMany({});
  await db.product.deleteMany({});
  await db.category.deleteMany({});
  for (const c of categories) {
    await db.category.create({ data: c });
  }
  console.log(`Categories: ${categories.length}`);
  for (const p of products) {
    const cat = await db.category.findUnique({ where: { slug: p.category } });
    if (!cat) throw new Error(`Category not found: ${p.category}`);
    const { category, image, ...rest } = p;
    await db.product.create({
      data: {
        ...rest,
        slug: slugify(p.name),
        categoryId: cat.id,
        images: JSON.stringify([image]),
      },
    });
  }
  console.log(`Products: ${products.length}`);

  // Demo orders for the admin
  await db.order.deleteMany({});
  const allProducts = await db.product.findMany();
  const sample = (n: number) => allProducts.slice(0, n);

  const mkOrder = async (status: string, daysAgo: number, method: string, items: any[]) => {
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const shipping = subtotal > 100 ? 0 : 6.99;
    const order = await db.order.create({
      data: {
        orderNumber: `SE-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`,
        userId: admin.id,
        email: admin.email,
        customerName: admin.name,
        phone: "",
        address: "",
        city: "",
        country: "",
        zip: "",
        status,
        subtotal,
        shipping,
        total: subtotal + shipping,
        paymentMethod: method,
        createdAt: new Date(Date.now() - daysAgo * 86400000),
        items: { create: items.map((it) => ({
          productId: it.id,
          productName: it.name,
          price: it.price,
          quantity: it.qty,
          image: JSON.parse(it.images)[0],
        })) },
      },
    });
    return order;
  };

  await mkOrder("COMPLETED", 21, "CARD", sample(2).map((p) => ({ id: p.id, name: p.name, price: p.price, qty: 1, images: p.images })));
  await mkOrder("SHIPPED", 6, "CARD", sample(3).map((p) => ({ id: p.id, name: p.name, price: p.price, qty: 1, images: p.images })));
  await mkOrder("PROCESSING", 2, "COD", [allProducts[0]].map((p) => ({ id: p.id, name: p.name, price: p.price, qty: 2, images: p.images })));

  console.log("Demo orders: 3");
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
