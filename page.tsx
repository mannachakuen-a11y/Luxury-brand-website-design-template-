import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { filterProducts, getCatalog, getWishlistIds } from "@/lib/queries";

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const { products } = await getCatalog();
  const wished = await getWishlistIds();
  const list = q.trim() ? filterProducts(products, { q }) : [];

  return (
    <div className="px-6 pb-24 pt-32 lg:px-12">
      <p className="label text-taupe">Search</p>
      <form action="/search" className="mt-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search the house"
          className="w-full border-0 border-b border-ink/20 bg-transparent pb-4 font-serif text-5xl italic outline-none placeholder:text-taupe/50 lg:text-7xl"
        />
      </form>
      <div className="mt-14">
        {q.trim() ? (
          list.length ? (
            <ProductGrid products={list} wished={wished} />
          ) : (
            <div>
              <p className="font-serif text-4xl">Nothing under that name.</p>
              <Link href="/shop" className="link-line mt-8">
                Browse the edit
              </Link>
            </div>
          )
        ) : (
          <p className="text-sm leading-7 text-taupe">Try a cloth, a colour, or a collection — silk, bordeaux, Nocturne.</p>
        )}
      </div>
    </div>
  );
}
