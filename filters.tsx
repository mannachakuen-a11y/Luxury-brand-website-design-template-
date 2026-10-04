"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "New" },
  { value: "price-asc", label: "Price, low" },
  { value: "price-desc", label: "Price, high" },
];

export function FilterBar({
  categories = [],
  colors,
  sizes,
  total,
}: {
  categories?: string[];
  colors: string[];
  sizes: string[];
  total: number;
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const activeCategory = params.get("category") ?? "";
  const activeColor = params.get("color") ?? "";
  const activeSize = params.get("size") ?? "";
  const activeSort = params.get("sort") ?? "featured";

  function update(key: string, value?: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    setOpen(null);
  }

  function clear() {
    router.push(pathname, { scroll: false });
    setOpen(null);
  }

  const chips = [
    activeCategory ? { key: "category", label: activeCategory } : null,
    activeColor ? { key: "color", label: activeColor } : null,
    activeSize ? { key: "size", label: `Size ${activeSize}` } : null,
  ].filter((chip): chip is { key: string; label: string } => Boolean(chip));

  return (
    <div className="border-b border-line pb-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {categories.length ? (
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            <button onClick={() => update("category")} className={`label ${!activeCategory ? "text-ink" : "text-taupe"}`}>
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => update("category", category === activeCategory ? undefined : category)}
                className={`label ${activeCategory === category ? "border-b border-ink pb-1 text-ink" : "text-taupe"}`}
              >
                {category}
              </button>
            ))}
          </div>
        ) : (
          <p className="label text-taupe">{String(total).padStart(2, "0")} pieces</p>
        )}
        <div className="flex flex-wrap gap-x-7 gap-y-3">
          <Menu
            label="Color"
            open={open === "color"}
            current={activeColor || "All"}
            onToggle={() => setOpen(open === "color" ? null : "color")}
            options={[{ value: "", label: "All colors" }, ...colors.map((color) => ({ value: color, label: color }))]}
            onSelect={(value) => update("color", value || undefined)}
          />
          <Menu
            label="Size"
            open={open === "size"}
            current={activeSize || "All"}
            onToggle={() => setOpen(open === "size" ? null : "size")}
            options={[{ value: "", label: "All sizes" }, ...sizes.map((size) => ({ value: size, label: size }))]}
            onSelect={(value) => update("size", value || undefined)}
          />
          <Menu
            label="Sort"
            open={open === "sort"}
            current={sorts.find((item) => item.value === activeSort)?.label ?? "Featured"}
            onToggle={() => setOpen(open === "sort" ? null : "sort")}
            options={sorts}
            onSelect={(value) => update("sort", value === "featured" ? undefined : value)}
          />
        </div>
      </div>
      {chips.length ? (
        <div className="mt-5 flex flex-wrap items-center gap-4">
          {chips.map((chip) => (
            <button key={chip.key} onClick={() => update(chip.key)} className="label text-taupe">
              {chip.label} ×
            </button>
          ))}
          <button onClick={clear} className="label">
            Clear
          </button>
        </div>
      ) : null}
      {categories.length ? <p className="mt-5 label text-taupe">{String(total).padStart(2, "0")} pieces</p> : null}
    </div>
  );
}

function Menu({
  label,
  current,
  open,
  onToggle,
  options,
  onSelect,
}: {
  label: string;
  current: string;
  open: boolean;
  onToggle: () => void;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="relative">
      <button onClick={onToggle} className="label" aria-expanded={open}>
        {label}
        <span className="ml-2 normal-case tracking-normal text-taupe">{current}</span>
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-3 min-w-40 border border-line bg-paper py-2">
          {options.map((option) => (
            <button
              key={option.label}
              onClick={() => onSelect(option.value)}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-ivory"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
