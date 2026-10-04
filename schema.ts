import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  season: text("season").notNull(),
  statement: text("statement").notNull(),
  story: text("story").notNull(),
  heroImage: text("hero_image").notNull(),
  secondaryImage: text("secondary_image").notNull(),
  videoUrl: text("video_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  collectionId: integer("collection_id").notNull(),
  description: text("description").notNull(),
  materials: text("materials").notNull(),
  details: text("details").notNull(),
  price: integer("price").notNull(),
  featured: boolean("featured").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  kind: text("kind").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const variants = pgTable("variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  color: text("color").notNull(),
  colorHex: text("color_hex").notNull(),
  size: text("size").notNull(),
  sku: text("sku").notNull(),
  stock: integer("stock").notNull().default(4),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  customerId: integer("customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull(),
  customerId: integer("customer_id"),
  productId: integer("product_id").notNull(),
  variantId: integer("variant_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const wishlistItems = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull(),
  customerId: integer("customer_id"),
  productId: integer("product_id").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  customerId: integer("customer_id"),
  email: text("email").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull().default(""),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postal: text("postal").notNull(),
  country: text("country").notNull(),
  shippingMethod: text("shipping_method").notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull(),
  total: integer("total").notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  productSlug: text("product_slug").notNull(),
  image: text("image").notNull(),
  color: text("color").notNull(),
  size: text("size").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
