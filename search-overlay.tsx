"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { money } from "@/lib/format";

type Result = {
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
};

export function SearchOverlay({ onClose, wordmark = "JONGLEI" }: { onClose: () => void; wordmark?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const value = query.trim();
    if (value.length < 2) {
      setResults([]);
      return;
    }
    const handle = window.setTimeout(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await response.json();
      setResults(data.results ?? []);
    }, 180);
    return () => window.clearTimeout(handle);
  }, [query]);

  return (
    <div className="menu-in fixed inset-0 z-50 overflow-y-auto bg-ink text-paper">
      <div className="px-6 py-6 lg:px-12">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="label">
            Close
          </button>
          <p className="font-serif text-sm tracking-[0.42em]">{wordmark}</p>
          <span className="label text-paper/0">Close</span>
        </div>
        <form
          className="mt-16 lg:mt-24"
          onSubmit={(event) => {
            event.preventDefault();
            const value = query.trim();
            if (!value) return;
            onClose();
            router.push(`/search?q=${encodeURIComponent(value)}`);
          }}
        >
          <label className="label text-paper/60" htmlFor="house-search">
            Search the house
          </label>
          <input
            id="house-search"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Gown, leather, pearl"
            className="mt-6 w-full border-0 border-b border-white/30 bg-transparent pb-4 font-serif text-4xl italic outline-none placeholder:text-paper/30 lg:text-6xl"
          />
        </form>
        <div className="mt-12 divide-y divide-white/10">
          {results.map((result) => (
            <Link
              key={result.slug}
              href={`/products/${result.slug}`}
              onClick={onClose}
              className="flex items-center gap-5 py-5"
            >
              {result.image ? <img src={result.image} alt="" className="h-20 w-16 object-cover" /> : <span className="h-20 w-16 bg-white/10" />}
              <span>
                <span className="block font-serif text-2xl">{result.name}</span>
                <span className="mt-2 block label text-paper/60">{result.category}</span>
              </span>
              <span className="ml-auto text-sm">{money(result.price)}</span>
            </Link>
          ))}
          {query.trim().length >= 2 && results.length === 0 ? (
            <p className="py-10 font-serif text-3xl">Nothing under that name.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
