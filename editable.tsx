"use client";

import Link from "next/link";
import { createContext, useContext, useRef, useState, type ElementType, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { request } from "@/lib/client";

const EditContext = createContext(false);

export function EditProvider({ editing, children }: { editing: boolean; children: ReactNode }) {
  return <EditContext.Provider value={editing}>{children}</EditContext.Provider>;
}

export function useEditing() {
  return useContext(EditContext);
}

async function save(key: string, value: string) {
  await request("/api/content", { json: { entries: { [key]: value } } });
}

/** Editable text. Renders as plain markup when not in Studio mode. */
export function T({
  k,
  value,
  as: Tag = "span",
  className = "",
}: {
  k: string;
  value: string;
  as?: ElementType;
  className?: string;
}) {
  const editing = useEditing();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const ref = useRef<HTMLElement>(null);

  if (!editing) return <Tag className={className}>{value}</Tag>;

  return (
    <Tag
      ref={ref}
      className={`${className} outline-dashed outline-1 outline-offset-4 outline-[#c65a2e]/60 focus:outline-[#c65a2e] ${
        state === "saving" ? "opacity-60" : ""
      }`}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-studio-key={k}
      title={`Edit: ${k}`}
      onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" && !event.shiftKey && Tag !== "p") {
          event.preventDefault();
          (event.currentTarget as HTMLElement).blur();
        }
      }}
      onBlur={async (event: React.FocusEvent<HTMLElement>) => {
        const next = event.currentTarget.innerText.trim();
        if (next === value) return;
        setState("saving");
        try {
          await save(k, next);
          setState("saved");
          router.refresh();
        } finally {
          setTimeout(() => setState("idle"), 800);
        }
      }}
    >
      {value}
    </Tag>
  );
}

/** Editable link / button: label and destination. */
export function L({
  labelKey,
  hrefKey,
  label,
  href,
  className = "",
  onClick,
}: {
  labelKey: string;
  hrefKey: string;
  label: string;
  href: string;
  className?: string;
  onClick?: () => void;
}) {
  const editing = useEditing();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nextLabel, setNextLabel] = useState(label);
  const [nextHref, setNextHref] = useState(href);

  if (!editing) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {label}
      </Link>
    );
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        className={`${className} outline-dashed outline-1 outline-offset-4 outline-[#c65a2e]/60`}
        title={`Edit button: ${labelKey}`}
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      {open ? (
        <span className="absolute left-0 top-full z-[60] mt-3 block w-72 border border-ink/15 bg-paper p-4 text-left text-ink normal-case tracking-normal shadow-none">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-taupe">Label</label>
          <input className="field text-sm" value={nextLabel} onChange={(e) => setNextLabel(e.target.value)} />
          <label className="mt-3 block text-[10px] uppercase tracking-[0.2em] text-taupe">Link to</label>
          <input className="field text-sm" value={nextHref} onChange={(e) => setNextHref(e.target.value)} />
          <span className="mt-4 flex gap-4 text-[11px] uppercase tracking-[0.2em]">
            <button
              type="button"
              className="border-b border-ink"
              onClick={async () => {
                await request("/api/content", { json: { entries: { [labelKey]: nextLabel, [hrefKey]: nextHref } } });
                setOpen(false);
                router.refresh();
              }}
            >
              Save
            </button>
            <button type="button" className="text-taupe" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <Link href={href} className="ml-auto text-taupe" onClick={() => setOpen(false)}>
              Follow link
            </Link>
          </span>
        </span>
      ) : null}
    </span>
  );
}

/** Editable image: swap by URL, upload, or pick from the house library. */
export function Img({
  k,
  src,
  alt = "",
  className = "",
  imgRef,
  style,
}: {
  k: string;
  src: string;
  alt?: string;
  className?: string;
  imgRef?: React.Ref<HTMLImageElement>;
  style?: React.CSSProperties;
}) {
  const editing = useEditing();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(src);
  const [library, setLibrary] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const image = <img ref={imgRef} src={src} alt={alt} className={className} style={style} />;
  if (!editing) return image;

  async function apply(next: string) {
    setBusy(true);
    try {
      await save(k, next);
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function openPanel() {
    setOpen(true);
    if (!library.length) {
      const response = await fetch("/api/library");
      const data = await response.json();
      setLibrary(data.images ?? []);
    }
  }

  return (
    <>
      {image}
      <button
        type="button"
        onClick={openPanel}
        className="absolute left-4 top-4 z-20 bg-[#c65a2e] px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-white"
        title={`Change image: ${k}`}
      >
        Change image
      </button>
      {open ? (
        <div className="fixed inset-0 z-[90] bg-ink/50" onClick={() => setOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-paper px-6 py-8 text-ink normal-case tracking-normal lg:px-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="label text-taupe">Image · {k}</p>
              <button className="label" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <img src={src} alt="" className="mt-6 aspect-[4/3] w-full object-cover" />
            <label className="mt-8 block text-sm">
              <span className="label text-taupe">Image URL</span>
              <input className="field mt-2" value={url} onChange={(e) => setUrl(e.target.value)} />
            </label>
            <div className="mt-4 flex gap-6">
              <button className="label border-b border-ink pb-1" disabled={busy} onClick={() => apply(url)}>
                Use URL
              </button>
              <label className="label cursor-pointer border-b border-ink pb-1">
                {busy ? "Uploading" : "Upload file"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setBusy(true);
                    const body = new FormData();
                    body.append("file", file);
                    const response = await fetch("/api/upload", { method: "POST", body });
                    const data = await response.json();
                    setBusy(false);
                    if (data.url) apply(data.url);
                  }}
                />
              </label>
            </div>
            <p className="mt-10 label text-taupe">House library</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {library.map((item) => (
                <button key={item} onClick={() => apply(item)} className="aspect-[3/4] overflow-hidden opacity-80 hover:opacity-100">
                  <img src={item} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function StudioBar() {
  const editing = useEditing();
  const router = useRouter();
  if (!editing) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-[85] flex -translate-x-1/2 items-center gap-6 bg-ink px-5 py-3 text-paper">
      <span className="text-[10px] uppercase tracking-[0.24em] text-[#e0855f]">Studio · editing</span>
      <Link href="/studio" className="text-[10px] uppercase tracking-[0.24em]">
        Open Studio
      </Link>
      <button
        className="text-[10px] uppercase tracking-[0.24em] text-paper/60"
        onClick={async () => {
          await request("/api/studio/auth", { json: { action: "logout" } });
          router.refresh();
        }}
      >
        Exit
      </button>
    </div>
  );
}
