"use client";

import Link from "next/link";
import type { NavLink } from "@/components/header";

export function MenuOverlay({
  links,
  wordmark,
  image,
  label,
  title,
  onClose,
  onSearch,
}: {
  links: NavLink[];
  wordmark: string;
  image: string;
  label: string;
  title: string;
  onClose: () => void;
  onSearch: () => void;
}) {
  return (
    <div className="menu-in fixed inset-0 z-50 overflow-y-auto bg-ink text-paper">
      <div className="grid min-h-[100svh] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col px-6 py-6 lg:px-12 lg:py-8">
          <div className="flex items-center justify-between">
            <button onClick={onClose} className="label">
              Close
            </button>
            <Link href="/" onClick={onClose} className="font-serif text-sm tracking-[0.42em]">
              {wordmark}
            </Link>
            <button onClick={onSearch} className="label">
              Search
            </button>
          </div>
          <nav className="mt-16 grid gap-x-16 sm:grid-cols-2 lg:mt-24">
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={onClose}
                className="border-b border-white/10 py-3 font-serif text-[2rem] italic leading-none tracking-[-0.03em] transition-opacity hover:opacity-55 sm:text-[2.4rem]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex gap-8 pt-16 label text-paper/60">
            <Link href="/account" onClick={onClose}>
              Account
            </Link>
            <Link href="/wishlist" onClick={onClose}>
              Wishlist
            </Link>
            <Link href="/cart" onClick={onClose}>
              Bag
            </Link>
          </div>
        </div>
        <div className="relative hidden min-h-[100svh] lg:block">
          {image ? <img src={image} alt="" className="h-full w-full object-cover grade" /> : null}
          <div className="absolute bottom-10 left-10">
            <p className="label text-paper/80">{label}</p>
            <p className="mt-3 font-serif text-5xl italic">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
