"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuOverlay } from "@/components/menu-overlay";
import { SearchOverlay } from "@/components/search-overlay";

export type NavLink = { label: string; href: string };

export function Header({
  bag,
  wish,
  customerName,
  wordmark,
  nav,
  menuImage,
  menuLabel,
  menuTitle,
}: {
  bag: number;
  wish: number;
  customerName: string | null;
  wordmark: string;
  nav: NavLink[];
  menuImage: string;
  menuLabel: string;
  menuTitle: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const overlay =
    pathname === "/" ||
    pathname === "/about" ||
    pathname.startsWith("/lookbook") ||
    pathname.startsWith("/campaign") ||
    pathname.startsWith("/collections/");
  const light = overlay && !scrolled && !menu && !search;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menu || search ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu, search]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        setSearch(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          light ? "bg-gradient-to-b from-black/50 to-transparent text-paper" : "border-b border-line bg-paper/95 text-ink backdrop-blur-md"
        }`}
      >
        <div className="grid h-[72px] grid-cols-[1fr_auto_1fr] items-center px-5 lg:px-12">
          <div className="flex items-center gap-6">
            <button onClick={() => setMenu(true)} className="label" aria-expanded={menu}>
              Menu
            </button>
            <button onClick={() => setSearch(true)} className="label hidden sm:block">
              Search
            </button>
          </div>
          <Link href="/" className="font-serif text-[13px] tracking-[0.28em] sm:text-[15px] sm:tracking-[0.42em] lg:tracking-[0.5em]" aria-label="Jonglei home">
            {wordmark}
          </Link>
          <div className="flex items-center justify-end gap-5 lg:gap-7">
            <Link href="/account" className="label hidden md:block">
              {customerName ? customerName.split(" ")[0] : "Account"}
            </Link>
            <Link href="/wishlist" className="label hidden sm:block">
              Wishlist
              {wish > 0 ? <sup className="ml-1 text-[9px]">{wish}</sup> : null}
            </Link>
            <Link href="/cart" className="label">
              Bag
              {bag > 0 ? <sup className="ml-1 text-[9px]">{bag}</sup> : null}
            </Link>
          </div>
        </div>
      </header>
      {menu ? (
        <MenuOverlay
          links={nav}
          wordmark={wordmark}
          image={menuImage}
          label={menuLabel}
          title={menuTitle}
          onClose={() => setMenu(false)}
          onSearch={() => {
            setMenu(false);
            setSearch(true);
          }}
        />
      ) : null}
      {search ? <SearchOverlay wordmark={wordmark} onClose={() => setSearch(false)} /> : null}
    </>
  );
}
