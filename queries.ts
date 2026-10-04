import { cache } from "react";
import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { ensureCatalog } from "@/db/ensure";
import {
  cartItems,
  collections,
  customers,
  orderItems,
  orders,
  productImages,
  products,
  variants,
  wishlistItems,
} from "@/db/schema";
import { readSession } from "@/lib/session";
import type { CartLine, CatalogProduct, HouseOrder } from "@/lib/types";

const sizeRank = ["OS", "34", "35", "36", "37", "38", "39", "40", "41", "42", "44"];

export const getCatalog = cache(async () => {
  await ensureCatalog();
  const cols = await db.select().from(collections).orderBy(asc(collections.sortOrder));
  const prods = await db.select().from(products);
  const images = await db.select().from(productImages).orderBy(asc(productImages.sortOrder));
  const vars = await db.select().from(variants);

  const assembled: CatalogProduct[] = prods
    .map((product) => {
      const collection = cols.find((item) => item.id === product.collectionId);
      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        collectionId: product.collectionId,
        collectionSlug: collection?.slug ?? "",
        collectionName: collection?.name ?? "",
        description: product.description,
        materials: product.materials,
        details: product.details,
        price: product.price,
        featured: product.featured,
        isNew: product.isNew,
        images: images
          .filter((image) => image.productId === product.id)
          .map((image) => ({
            url: image.url,
            alt: image.alt,
            kind: image.kind,
            sortOrder: image.sortOrder,
          })),
        variants: vars
          .filter((variant) => variant.productId === product.id)
          .map((variant) => ({
            id: variant.id,
            color: variant.color,
            colorHex: variant.colorHex,
            size: variant.size,
            sku: variant.sku,
            stock: variant.stock,
          }))
          .sort(
            (a, b) =>
              sizeRank.indexOf(a.size) - sizeRank.indexOf(b.size) || a.color.localeCompare(b.color),
          ),
      };
    })
    .sort((a, b) => a.id - b.id);

  return {
    collections: cols,
    products: assembled,
  };
});

export function sortProducts(list: CatalogProduct[], sort?: string) {
  const next = [...list];
  if (sort === "price-asc") next.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") next.sort((a, b) => b.price - a.price);
  else if (sort === "new") next.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id);
  else next.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  return next;
}

export function filterProducts(
  list: CatalogProduct[],
  filters: {
    collection?: string;
    category?: string;
    color?: string;
    size?: string;
    sort?: string;
    q?: string;
    featured?: boolean;
  },
) {
  const query = filters.q?.trim().toLowerCase();
  const filtered = list.filter((product) => {
    if (filters.collection && product.collectionSlug !== filters.collection) return false;
    if (filters.category && product.category !== filters.category) return false;
    if (filters.featured && !product.featured) return false;
    if (filters.color && !product.variants.some((variant) => variant.color === filters.color)) return false;
    if (filters.size && !product.variants.some((variant) => variant.size === filters.size)) return false;
    if (query) {
      const haystack = [
        product.name,
        product.category,
        product.collectionName,
        product.description,
        product.materials,
        ...product.variants.map((variant) => variant.color),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
  return sortProducts(filtered, filters.sort);
}

async function ownerIds() {
  const session = await readSession();
  if (!session) return null;
  if (session.customerId) {
    await db
      .update(cartItems)
      .set({ customerId: session.customerId })
      .where(eq(cartItems.sessionToken, session.token));
    await db
      .update(wishlistItems)
      .set({ customerId: session.customerId })
      .where(eq(wishlistItems.sessionToken, session.token));
  }
  return session;
}

export async function getCart(): Promise<CartLine[]> {
  await ensureCatalog();
  const session = await ownerIds();
  if (!session) return [];
  const rows = await db
    .select()
    .from(cartItems)
    .where(
      session.customerId
        ? eq(cartItems.customerId, session.customerId)
        : eq(cartItems.sessionToken, session.token),
    );
  if (!rows.length) return [];
  const catalog = await getCatalog();
  return rows
    .map((row) => {
      const product = catalog.products.find((item) => item.id === row.productId);
      const variant = product?.variants.find((item) => item.id === row.variantId);
      if (!product || !variant) return null;
      const image = product.images.find((item) => item.kind !== "video") ?? product.images[0];
      return {
        id: row.id,
        quantity: row.quantity,
        variantId: variant.id,
        productId: product.id,
        color: variant.color,
        size: variant.size,
        stock: variant.stock,
        price: product.price,
        name: product.name,
        slug: product.slug,
        image: image?.url ?? "",
        category: product.category,
      };
    })
    .filter((row): row is CartLine => Boolean(row));
}

export async function getWishlistIds() {
  await ensureCatalog();
  const session = await ownerIds();
  if (!session) return [] as number[];
  const rows = await db
    .select()
    .from(wishlistItems)
    .where(
      session.customerId
        ? eq(wishlistItems.customerId, session.customerId)
        : eq(wishlistItems.sessionToken, session.token),
    );
  return rows.map((row) => row.productId);
}

export async function getHeaderState() {
  const [cart, wished, session] = await Promise.all([getCart(), getWishlistIds(), readSession()]);
  let customerName: string | null = null;
  let customerEmail: string | null = null;
  if (session?.customerId) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, session.customerId))
      .limit(1);
    customerName = customer?.name ?? null;
    customerEmail = customer?.email ?? null;
  }
  return {
    bag: cart.reduce((sum, line) => sum + line.quantity, 0),
    wish: wished.length,
    customerName,
    customerEmail,
  };
}

export async function getOrdersForCustomer(): Promise<HouseOrder[]> {
  await ensureCatalog();
  const session = await readSession();
  if (!session?.customerId) return [];
  const rows = await db.select().from(orders).where(eq(orders.customerId, session.customerId));
  if (!rows.length) return [];
  const items = await db
    .select()
    .from(orderItems)
    .where(
      inArray(
        orderItems.orderId,
        rows.map((row) => row.id),
      ),
    );
  return rows
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((order) => ({
      number: order.number,
      email: order.email,
      name: order.name,
      phone: order.phone,
      address: order.address,
      city: order.city,
      postal: order.postal,
      country: order.country,
      shippingMethod: order.shippingMethod,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      items: items
        .filter((item) => item.orderId === order.id)
        .map((item) => ({
          productName: item.productName,
          productSlug: item.productSlug,
          image: item.image,
          color: item.color,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
        })),
    }));
}

export async function getOrder(number: string) {
  await ensureCatalog();
  const [order] = await db.select().from(orders).where(eq(orders.number, number)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return {
    number: order.number,
    email: order.email,
    name: order.name,
    phone: order.phone,
    address: order.address,
    city: order.city,
    postal: order.postal,
    country: order.country,
    shippingMethod: order.shippingMethod,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
    items: items.map((item) => ({
      productName: item.productName,
      productSlug: item.productSlug,
      image: item.image,
      color: item.color,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
    })),
  } satisfies HouseOrder;
}
