export type CatalogImage = {
  url: string;
  alt: string;
  kind: string;
  sortOrder: number;
};

export type CatalogVariant = {
  id: number;
  color: string;
  colorHex: string;
  size: string;
  sku: string;
  stock: number;
};

export type CatalogProduct = {
  id: number;
  slug: string;
  name: string;
  category: string;
  collectionId: number;
  collectionSlug: string;
  collectionName: string;
  description: string;
  materials: string;
  details: string;
  price: number;
  featured: boolean;
  isNew: boolean;
  images: CatalogImage[];
  variants: CatalogVariant[];
};

export type CatalogCollection = {
  id: number;
  slug: string;
  name: string;
  season: string;
  statement: string;
  story: string;
  heroImage: string;
  secondaryImage: string;
  videoUrl: string | null;
  sortOrder: number;
};

export type CartLine = {
  id: number;
  quantity: number;
  variantId: number;
  productId: number;
  color: string;
  size: string;
  stock: number;
  price: number;
  name: string;
  slug: string;
  image: string;
  category: string;
};

export type OrderLine = {
  productName: string;
  productSlug: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
};

export type HouseOrder = {
  number: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
  country: string;
  shippingMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: Date;
  items: OrderLine[];
};
