"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { request } from "@/lib/client";
import { money } from "@/lib/format";
import type { CartLine } from "@/lib/types";

export function CartView({ lines }: { lines: CartLine[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<number | null>(null);
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  async function update(id: number, quantity: number) {
    setPending(id);
    try {
      await request("/api/cart", { method: "PATCH", json: { id, quantity } });
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  async function remove(id: number) {
    setPending(id);
    try {
      await request(`/api/cart?id=${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  if (!lines.length) {
    return (
      <div className="px-6 pb-24 pt-32 lg:px-12">
        <p className="label text-taupe">Bag</p>
        <h1 className="mt-4 font-serif text-6xl">Your bag is empty.</h1>
        <Link href="/collections/nocturne" className="link-line mt-10">
          Explore Nocturne
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 pb-24 pt-32 lg:px-12">
      <p className="label text-taupe">Bag</p>
      <h1 className="mt-4 font-serif text-6xl lg:text-7xl">Your selection</h1>
      <div className="mt-16 grid gap-16 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          {lines.map((line) => (
            <div key={line.id} className="grid grid-cols-[92px_1fr] gap-5 border-t border-line py-7 sm:grid-cols-[120px_1fr_auto]">
              <Link href={`/products/${line.slug}`}>
                <img src={line.image} alt="" className="aspect-[3/4] w-full object-cover grade" />
              </Link>
              <div>
                <Link href={`/products/${line.slug}`} className="font-serif text-3xl">
                  {line.name}
                </Link>
                <p className="mt-2 label text-taupe">{line.category}</p>
                <p className="mt-4 text-sm">
                  {line.color} / {line.size}
                </p>
                <div className="mt-5 flex items-center gap-4 text-sm">
                  <button aria-label="Decrease quantity" onClick={() => update(line.id, line.quantity - 1)} disabled={line.quantity <= 1 || pending === line.id}>
                    –
                  </button>
                  <span>{line.quantity}</span>
                  <button aria-label="Increase quantity" onClick={() => update(line.id, Math.min(line.stock, line.quantity + 1))} disabled={line.quantity >= line.stock || pending === line.id}>
                    +
                  </button>
                  <button onClick={() => remove(line.id)} className="ml-4 label text-taupe">
                    Remove
                  </button>
                </div>
              </div>
              <p className="hidden text-sm sm:block">{money(line.price * line.quantity)}</p>
            </div>
          ))}
        </div>
        <aside className="h-fit lg:sticky lg:top-28">
          <div className="border-t border-line pt-6">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-taupe">Delivery is calculated at checkout. Complimentary over €500.</p>
            <Link href="/checkout" className="mt-8 flex h-14 items-center justify-center bg-ink text-paper label">
              Checkout
            </Link>
            <Link href="/shop" className="link-line mt-6">
              Continue
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
