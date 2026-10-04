import { eq } from "drizzle-orm";
import { pool, db } from "@/db";
import {
  collections,
  customers,
  productImages,
  products,
  variants,
} from "@/db/schema";
import {
  collectionSeeds,
  DEMO_EMAIL,
  DEMO_NAME,
  DEMO_PASSWORD,
  photo,
  productSeeds,
} from "@/db/catalog-data";
import { hashPassword } from "@/lib/password";

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS collections (
    id serial PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    name text NOT NULL,
    season text NOT NULL,
    statement text NOT NULL,
    story text NOT NULL,
    hero_image text NOT NULL,
    secondary_image text NOT NULL,
    video_url text,
    sort_order integer NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id serial PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    name text NOT NULL,
    category text NOT NULL,
    collection_id integer NOT NULL,
    description text NOT NULL,
    materials text NOT NULL,
    details text NOT NULL,
    price integer NOT NULL,
    featured boolean NOT NULL DEFAULT false,
    is_new boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS product_images (
    id serial PRIMARY KEY,
    product_id integer NOT NULL,
    url text NOT NULL,
    alt text NOT NULL,
    kind text NOT NULL,
    sort_order integer NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS variants (
    id serial PRIMARY KEY,
    product_id integer NOT NULL,
    color text NOT NULL,
    color_hex text NOT NULL,
    size text NOT NULL,
    sku text NOT NULL,
    stock integer NOT NULL DEFAULT 4
  )`,
  `CREATE TABLE IF NOT EXISTS customers (
    id serial PRIMARY KEY,
    email text NOT NULL UNIQUE,
    name text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id serial PRIMARY KEY,
    token text NOT NULL UNIQUE,
    customer_id integer,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS cart_items (
    id serial PRIMARY KEY,
    session_token text NOT NULL,
    customer_id integer,
    product_id integer NOT NULL,
    variant_id integer NOT NULL,
    quantity integer NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS wishlist_items (
    id serial PRIMARY KEY,
    session_token text NOT NULL,
    customer_id integer,
    product_id integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id serial PRIMARY KEY,
    number text NOT NULL UNIQUE,
    customer_id integer,
    email text NOT NULL,
    name text NOT NULL,
    phone text NOT NULL DEFAULT '',
    address text NOT NULL,
    city text NOT NULL,
    postal text NOT NULL,
    country text NOT NULL,
    shipping_method text NOT NULL,
    subtotal integer NOT NULL,
    shipping integer NOT NULL,
    total integer NOT NULL,
    status text NOT NULL DEFAULT 'confirmed',
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id serial PRIMARY KEY,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    product_name text NOT NULL,
    product_slug text NOT NULL,
    image text NOT NULL,
    color text NOT NULL,
    size text NOT NULL,
    price integer NOT NULL,
    quantity integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS messages (
    id serial PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS newsletter (
    id serial PRIMARY KEY,
    email text NOT NULL UNIQUE,
    created_at timestamp NOT NULL DEFAULT now()
  )`,
];

let pending: Promise<void> | null = null;

export function ensureCatalog() {
  if (!pending) {
    pending = run().catch((error) => {
      pending = null;
      throw error;
    });
  }
  return pending;
}

async function run() {
  for (const statement of STATEMENTS) {
    await pool.query(statement);
  }

  const existing = await db.select({ id: products.id }).from(products).limit(1);
  if (existing.length === 0) {
    const insertedCollections = await db
      .insert(collections)
      .values(
        collectionSeeds.map((collection) => ({
          slug: collection.slug,
          name: collection.name,
          season: collection.season,
          statement: collection.statement,
          story: collection.story,
          heroImage: photo(collection.heroId, 2200),
          secondaryImage: photo(collection.secondaryId, 1800),
          videoUrl: collection.videoUrl,
          sortOrder: collection.sortOrder,
        })),
      )
      .returning();

    const collectionId = Object.fromEntries(
      insertedCollections.map((collection) => [collection.slug, collection.id]),
    );

    const insertedProducts = await db
      .insert(products)
      .values(
        productSeeds.map((product) => ({
          slug: product.slug,
          name: product.name,
          category: product.category,
          collectionId: collectionId[product.collection],
          description: product.description,
          materials: product.materials,
          details: product.details,
          price: product.price,
          featured: product.featured,
          isNew: product.isNew,
        })),
      )
      .returning();

    const productId = Object.fromEntries(insertedProducts.map((product) => [product.slug, product.id]));

    await db.insert(productImages).values(
      productSeeds.flatMap((product) =>
        product.images.map((image, index) => ({
          productId: productId[product.slug],
          url: image.url ?? photo(image.id ?? 0, image.kind === "detail" ? 1400 : 1800),
          alt: image.alt,
          kind: image.kind,
          sortOrder: index,
        })),
      ),
    );

    await db.insert(variants).values(
      productSeeds.flatMap((product) =>
        product.colors.flatMap((color) =>
          product.sizes.map((size) => ({
            productId: productId[product.slug],
            color: color.name,
            colorHex: color.hex,
            size,
            sku: `SV-${product.slug}-${color.name}-${size}`.toUpperCase().replace(/\s+/g, ""),
            stock:
              product.slug === "piano-gown" && size === "44"
                ? 0
                : size === "44" || size === "41"
                  ? 2
                  : size === "34"
                    ? 3
                    : 6,
          })),
        ),
      ),
    );
  }

  const [customer] = await db
    .select({ id: customers.id })
    .from(customers)
    .where(eq(customers.email, DEMO_EMAIL))
    .limit(1);

  if (!customer) {
    const [legacyCustomer] = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.email, "client@maisonsevre.com"))
      .limit(1);

    if (legacyCustomer) {
      await db
        .update(customers)
        .set({ email: DEMO_EMAIL })
        .where(eq(customers.id, legacyCustomer.id));
    } else {
      await db.insert(customers).values({
        email: DEMO_EMAIL,
        name: DEMO_NAME,
        passwordHash: hashPassword(DEMO_PASSWORD),
      });
    }
  }
}
