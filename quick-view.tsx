"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Purchase } from "@/components/purchase";
import type { CatalogProduct } from "@/lib/types";

export function QuickView({
  product,
  saved,
  onClose,
}: {
  product: CatalogProduct;
  saved: boolean;
  onClose: () => void;
}) {
  const image = product.images.find((item) => item.kind !== "video") ?? product.images[0];
  const alternate = product.images.find((item) => item !== image && item.kind !== "video");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] bg-ink/50" onClick={onClose}>
      <div
        className="absolute left-1/2 top-1/2 grid max-h-[90svh] w-[min(980px,calc(100%-1.5rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-paper text-ink md:grid-cols-2"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-ivory">
          {image ? <img src={image.url} alt={image.alt} className="aspect-[3/4] w-full object-cover grade md:h-full md:aspect-auto" /> : null}
        </div>
        <div className="relative px-6 py-8 lg:px-10 lg:py-12">
          <button onClick={onClose} className="label text-taupe">
            Close
          </button>
          <div className="mt-8">
            <Purchase product={product} saved={saved} compact />
          </div>
          {alternate ? <p className="mt-8 text-sm leading-7 text-charcoal">{product.description}</p> : <p className="mt-8 text-sm leading-7 text-charcoal">{product.description}</p>}
          <Link href={`/products/${product.slug}`} className="link-line mt-8" onClick={onClose}>
            View the piece
          </Link>
        </div>
      </div>
    </div>
  );
}
