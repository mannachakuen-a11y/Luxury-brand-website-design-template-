"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { request } from "@/lib/client";
import type { CatalogProduct } from "@/lib/types";

export function WishlistView({ products }: { products: CatalogProduct[] }) {
  const router = useRouter();

  if (!products.length) {
    return (
      <div>
        <p className="label text-taupe">Wishlist</p>
        <h1 className="mt-4 font-serif text-6xl">Nothing saved.</h1>
        <Link href="/shop" className="link-line mt-10">
          Browse the edit
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="label text-taupe">Wishlist</p>
      <h1 className="mt-4 font-serif text-6xl lg:text-7xl">Saved</h1>
      <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-14 lg:grid-cols-4 lg:gap-x-6">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} wished />
            <button
              className="mt-3 label text-taupe"
              onClick={async () => {
                await request("/api/wishlist", { json: { productId: product.id } });
                router.refresh();
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
