import { ProductCard } from "@/components/product-card";
import type { CatalogProduct } from "@/lib/types";

export function ProductGrid({ products, wished = [] }: { products: CatalogProduct[]; wished?: number[] }) {
  if (!products.length) {
    return <p className="py-20 font-serif text-3xl">No pieces match this edit.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-14 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-20">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} wished={wished.includes(product.id)} />
      ))}
    </div>
  );
}
