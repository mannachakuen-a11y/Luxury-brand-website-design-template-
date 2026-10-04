"use client";

import Link from "next/link";
import { useState } from "react";
import { QuickView } from "@/components/quick-view";
import { money } from "@/lib/format";
import type { CatalogProduct } from "@/lib/types";

export function ProductCard({ product, wished = false }: { product: CatalogProduct; wished?: boolean }) {
  const [open, setOpen] = useState(false);
  const images = product.images.filter((image) => image.kind !== "video");
  const primary = images[0];
  const secondary = images[1] ?? images[0];

  return (
    <article className="group">
      <div className="card-visual relative overflow-hidden bg-ivory">
        <Link href={`/products/${product.slug}`} className="block aspect-[3/4] overflow-hidden">
          {primary ? (
            <img
              src={primary.url}
              alt={primary.alt}
              className="card-prim h-full w-full object-cover grade"
            />
          ) : null}
          {secondary ? (
            <img
              src={secondary.url}
              alt=""
              className="card-sec absolute inset-0 h-full w-full object-cover grade opacity-0"
            />
          ) : null}
        </Link>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent opacity-80 lg:opacity-0 lg:transition lg:duration-700 lg:group-hover:opacity-100" />
        <button
          onClick={() => setOpen(true)}
          className="absolute bottom-4 left-4 label text-paper opacity-100 lg:opacity-0 lg:transition lg:duration-700 lg:group-hover:opacity-100"
        >
          Quick view
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-[1.35rem] leading-tight lg:text-[1.55rem]">{product.name}</h3>
          </Link>
          <p className="mt-2 label text-taupe">{product.category}</p>
        </div>
        <p className="pt-1 text-sm">{money(product.price)}</p>
      </div>
      {open ? <QuickView product={product} saved={wished} onClose={() => setOpen(false)} /> : null}
    </article>
  );
}
