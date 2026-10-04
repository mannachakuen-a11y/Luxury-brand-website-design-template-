"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SizeTables } from "@/components/size-tables";
import { request } from "@/lib/client";
import { money } from "@/lib/format";
import type { CatalogProduct } from "@/lib/types";

export function Purchase({
  product,
  saved,
  compact = false,
  sticky = false,
}: {
  product: CatalogProduct;
  saved: boolean;
  compact?: boolean;
  sticky?: boolean;
}) {
  const router = useRouter();
  const colors = useMemo(() => {
    const map = new Map<string, string>();
    for (const variant of product.variants) map.set(variant.color, variant.colorHex);
    return [...map.entries()];
  }, [product.variants]);
  const sizes = useMemo(() => [...new Set(product.variants.map((variant) => variant.size))], [product.variants]);
  const [color, setColor] = useState(colors[0]?.[0] ?? "");
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0] : "");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [wished, setWished] = useState(saved);
  const [guide, setGuide] = useState(false);
  const variant = product.variants.find((item) => item.color === color && item.size === size);
  const sizeId = `size-${product.slug}-${compact ? "quick" : "page"}`;

  async function add() {
    if (!size) {
      setNote("Please select a size.");
      document.getElementById(sizeId)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!variant || variant.stock < 1) {
      setNote("This size is currently unavailable.");
      return;
    }
    setPending(true);
    setNote("");
    try {
      await request("/api/cart", { method: "POST", json: { variantId: variant.id, quantity: 1 } });
      setNote("Placed in your bag.");
      router.refresh();
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function wish() {
    try {
      const data = await request("/api/wishlist", { method: "POST", json: { productId: product.id } });
      setWished(Boolean(data.saved));
      router.refresh();
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Please try again.");
    }
  }

  const Title = compact ? "h2" : "h1";

  return (
    <div>
      <Title className={`font-serif leading-none ${compact ? "text-4xl" : "text-5xl lg:text-6xl"}`}>{product.name}</Title>
      <p className="mt-4 text-sm tracking-wide">{money(product.price)}</p>
      <p className="mt-3 label text-taupe">{product.category}</p>

      <div className="mt-10">
        <p className="label text-taupe">Color</p>
        <div className="mt-4 flex flex-wrap gap-5">
          {colors.map(([name, hex]) => (
            <button
              key={name}
              onClick={() => setColor(name)}
              className={`flex items-center gap-3 text-sm ${color === name ? "text-ink" : "text-taupe"}`}
            >
              <span className="h-3 w-3 border border-ink/30" style={{ background: hex }} />
              <span className={color === name ? "border-b border-ink pb-0.5" : ""}>{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div id={sizeId} className="mt-8">
        <div className="flex items-center justify-between">
          <p className="label text-taupe">Size</p>
          <button type="button" onClick={() => setGuide(true)} className="text-xs tracking-wide text-taupe underline underline-offset-4">
            Size guide
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
          {sizes.map((option) => {
            const match = product.variants.find((item) => item.color === color && item.size === option);
            const unavailable = !match || match.stock < 1;
            return (
              <button
                key={option}
                disabled={unavailable}
                onClick={() => setSize(option)}
                className={`min-w-8 text-sm tracking-[0.14em] ${
                  size === option ? "border-b border-ink pb-1 text-ink" : "text-taupe"
                } ${unavailable ? "cursor-not-allowed line-through opacity-35" : ""}`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {variant && variant.stock > 0 && variant.stock <= 2 ? (
          <p className="mt-4 text-xs tracking-wide text-taupe">{variant.stock === 1 ? "One remaining" : "Two remaining"}</p>
        ) : null}
      </div>

      <button
        onClick={add}
        disabled={pending}
        className="mt-10 h-14 w-full bg-ink text-paper label transition-colors hover:bg-charcoal disabled:opacity-50"
      >
        {pending ? "Adding" : "Add to Bag"}
      </button>
      <button onClick={wish} className="mt-4 w-full py-3 text-center label text-taupe">
        {wished ? "Saved to wishlist" : "Save to wishlist"}
      </button>
      {note ? (
        <p className="mt-4 text-sm">
          {note}{" "}
          {note === "Placed in your bag." ? (
            <Link href="/cart" className="border-b border-ink">
              View bag
            </Link>
          ) : null}
        </p>
      ) : null}

      {sticky ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-veil px-5 py-3 lg:hidden">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-serif text-xl leading-none">{product.name}</p>
              <p className="mt-1 text-sm">{money(product.price)}</p>
            </div>
            <button onClick={add} className="ml-auto h-12 bg-ink px-6 text-paper label">
              {pending ? "Adding" : "Add"}
            </button>
          </div>
        </div>
      ) : null}

      {guide ? (
        <div className="fixed inset-0 z-[75] bg-ink/40" onClick={() => setGuide(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-paper px-6 py-8 text-ink lg:px-12"
            onClick={(event) => event.stopPropagation()}
          >
            <button onClick={() => setGuide(false)} className="label">
              Close
            </button>
            <h2 className="mt-10 font-serif text-5xl">Size guide</h2>
            <div className="mt-10">
              <SizeTables />
            </div>
            <Link href="/size-guide" className="link-line mt-10">
              Full size guide
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
