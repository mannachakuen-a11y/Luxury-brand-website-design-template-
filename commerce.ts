import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  cartItems,
  customers,
  messages,
  newsletter,
  orderItems,
  orders,
  sessions,
  variants,
  wishlistItems,
} from "@/db/schema";
import { shippingCost } from "@/lib/house";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getCart } from "@/lib/queries";
import { getWritableSession } from "@/lib/session";

export class ClientError extends Error {}

async function migrateToCustomer(token: string, customerId: number) {
  await db.update(sessions).set({ customerId }).where(eq(sessions.token, token));
  await db.update(cartItems).set({ customerId }).where(eq(cartItems.sessionToken, token));
  await db.update(wishlistItems).set({ customerId }).where(eq(wishlistItems.sessionToken, token));
}

export async function registerAccount(input: { name: string; email: string; password: string }) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  if (name.length < 2) throw new ClientError("Please leave a name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ClientError("Please leave a valid email.");
  if (password.length < 8) throw new ClientError("Use at least 8 characters.");

  const [existing] = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
  if (existing) throw new ClientError("An account already exists for this email. Sign in instead.");

  const [customer] = await db
    .insert(customers)
    .values({ name, email, passwordHash: hashPassword(password) })
    .returning();
  const session = await getWritableSession();
  await migrateToCustomer(session.token, customer.id);
  return { name: customer.name, email: customer.email };
}

export async function loginAccount(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const [customer] = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
  if (!customer || !verifyPassword(input.password, customer.passwordHash)) {
    throw new ClientError("Those details do not match our salon records.");
  }
  const session = await getWritableSession();
  await migrateToCustomer(session.token, customer.id);
  return { name: customer.name, email: customer.email };
}

export async function logoutAccount() {
  const session = await getWritableSession();
  await db.update(sessions).set({ customerId: null }).where(eq(sessions.id, session.id));
}

export async function addToCart(variantId: number, quantity = 1) {
  const qty = Math.max(1, Math.min(4, quantity));
  const session = await getWritableSession();
  const [variant] = await db.select().from(variants).where(eq(variants.id, variantId)).limit(1);
  if (!variant) throw new ClientError("This piece is no longer available.");
  if (variant.stock < 1) throw new ClientError("This size is currently unavailable.");

  const owner = session.customerId
    ? eq(cartItems.customerId, session.customerId)
    : eq(cartItems.sessionToken, session.token);
  const [existing] = await db
    .select()
    .from(cartItems)
    .where(and(owner, eq(cartItems.variantId, variantId)))
    .limit(1);

  const nextQty = Math.min(variant.stock, (existing?.quantity ?? 0) + qty);
  if (existing) {
    await db.update(cartItems).set({ quantity: nextQty }).where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({
      sessionToken: session.token,
      customerId: session.customerId,
      productId: variant.productId,
      variantId,
      quantity: nextQty,
    });
  }
  return getCart();
}

export async function updateCartQuantity(itemId: number, quantity: number) {
  const session = await getWritableSession();
  const owner = session.customerId
    ? eq(cartItems.customerId, session.customerId)
    : eq(cartItems.sessionToken, session.token);
  const [item] = await db
    .select()
    .from(cartItems)
    .where(and(owner, eq(cartItems.id, itemId)))
    .limit(1);
  if (!item) throw new ClientError("That piece is no longer in your bag.");
  const [variant] = await db.select().from(variants).where(eq(variants.id, item.variantId)).limit(1);
  const next = Math.max(1, Math.min(quantity, variant?.stock ?? 1));
  await db.update(cartItems).set({ quantity: next }).where(eq(cartItems.id, item.id));
  return getCart();
}

export async function removeCartItem(itemId: number) {
  const session = await getWritableSession();
  const owner = session.customerId
    ? eq(cartItems.customerId, session.customerId)
    : eq(cartItems.sessionToken, session.token);
  await db.delete(cartItems).where(and(owner, eq(cartItems.id, itemId)));
  return getCart();
}

export async function toggleWishlist(productId: number) {
  const session = await getWritableSession();
  const owner = session.customerId
    ? eq(wishlistItems.customerId, session.customerId)
    : eq(wishlistItems.sessionToken, session.token);
  const [existing] = await db
    .select()
    .from(wishlistItems)
    .where(and(owner, eq(wishlistItems.productId, productId)))
    .limit(1);
  if (existing) {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, existing.id));
    return { saved: false };
  }
  await db.insert(wishlistItems).values({
    sessionToken: session.token,
    customerId: session.customerId,
    productId,
  });
  return { saved: true };
}

export async function subscribeNewsletter(email: string) {
  const value = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new ClientError("Please leave a valid email.");
  }
  await db.insert(newsletter).values({ email: value }).onConflictDoNothing({ target: newsletter.email });
}

export async function sendMessage(input: {
  name: string;
  email: string;
  subject: string;
  body: string;
}) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const subject = input.subject.trim();
  const body = input.body.trim();
  if (name.length < 2 || subject.length < 2 || body.length < 8) {
    throw new ClientError("Please complete the note before sending.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ClientError("Please leave a valid email.");
  }
  await db.insert(messages).values({ name, email, subject, body });
}

export type CheckoutInput = {
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
  country: string;
  shippingMethod: string;
};

export async function placeOrder(input: CheckoutInput) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const address = input.address.trim();
  const city = input.city.trim();
  const postal = input.postal.trim();
  const country = input.country.trim();
  const phone = input.phone.trim();
  const method = input.shippingMethod === "express" ? "express" : "standard";

  if (name.length < 2) throw new ClientError("Please leave the name for delivery.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ClientError("Please leave a valid email.");
  if (address.length < 4 || city.length < 2 || postal.length < 3 || !country) {
    throw new ClientError("Please complete the delivery address.");
  }

  const session = await getWritableSession();
  const lines = await getCart();
  if (!lines.length) throw new ClientError("Your bag is empty.");

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shipping = shippingCost(subtotal, method);
  const total = subtotal + shipping;
  const number = `SV${Math.floor(100000 + Math.random() * 900000)}`;

  await db.transaction(async (tx) => {
    for (const line of lines) {
      const updated = await tx
        .update(variants)
        .set({ stock: sql`${variants.stock} - ${line.quantity}` })
        .where(and(eq(variants.id, line.variantId), gte(variants.stock, line.quantity)))
        .returning();
      if (!updated.length) {
        throw new ClientError(`${line.name} in size ${line.size} is no longer available in that quantity.`);
      }
    }

    const [order] = await tx
      .insert(orders)
      .values({
        number,
        customerId: session.customerId,
        email,
        name,
        phone,
        address,
        city,
        postal,
        country,
        shippingMethod: method,
        subtotal,
        shipping,
        total,
        status: "confirmed",
      })
      .returning();

    await tx.insert(orderItems).values(
      lines.map((line) => ({
        orderId: order.id,
        productId: line.productId,
        productName: line.name,
        productSlug: line.slug,
        image: line.image,
        color: line.color,
        size: line.size,
        price: line.price,
        quantity: line.quantity,
      })),
    );

    if (session.customerId) {
      await tx.delete(cartItems).where(eq(cartItems.customerId, session.customerId));
    } else {
      await tx.delete(cartItems).where(eq(cartItems.sessionToken, session.token));
    }
  });

  return { number };
}
