"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { request } from "@/lib/client";
import { contentDefaults, contentGroups, isImageKey, isLinkKey, isLongKey } from "@/lib/content-defaults";
import type { CatalogCollection, CatalogProduct } from "@/lib/types";

type Tab = "content" | "products" | "collections" | "export";

export function StudioLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      className="max-w-md"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        try {
          await request("/api/studio/auth", { json: { password } });
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Please try again.");
        }
      }}
    >
      <label className="block text-sm">
        <span className="label text-taupe">Studio key</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field mt-2" />
      </label>
      <p className="mt-3 text-xs text-taupe">Default key: atelier (set STUDIO_PASSWORD to change it).</p>
      {error ? <p className="mt-3 text-sm">{error}</p> : null}
      <button className="mt-8 h-14 w-full bg-ink text-paper label">Enter Studio</button>
    </form>
  );
}

export function Studio({
  content,
  products,
  collections,
}: {
  content: Record<string, string>;
  products: CatalogProduct[];
  collections: CatalogCollection[];
}) {
  const [tab, setTab] = useState<Tab>("content");
  const router = useRouter();

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 border-b border-line pb-5">
        {(
          [
            ["content", "Texts, buttons & images"],
            ["products", "Products"],
            ["collections", "Collections"],
            ["export", "Figma / Framer export"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`label ${tab === id ? "border-b border-ink pb-1" : "text-taupe"}`}>
            {label}
          </button>
        ))}
        <Link href="/" className="label ml-auto text-[#c65a2e]">
          Edit on the page →
        </Link>
        <button
          className="label text-taupe"
          onClick={async () => {
            await request("/api/studio/auth", { json: { action: "logout" } });
            router.push("/");
            router.refresh();
          }}
        >
          Sign out
        </button>
      </div>
      <div className="mt-10">
        {tab === "content" ? <ContentEditor content={content} /> : null}
        {tab === "products" ? <ProductsEditor products={products} /> : null}
        {tab === "collections" ? <CollectionsEditor collections={collections} /> : null}
        {tab === "export" ? <ExportPanel content={content} /> : null}
      </div>
    </div>
  );
}

function ContentEditor({ content }: { content: Record<string, string> }) {
  const router = useRouter();
  const [draft, setDraft] = useState(content);
  const [note, setNote] = useState("");
  const dirty = Object.keys(draft).filter((key) => draft[key] !== content[key]);

  async function saveAll() {
    const entries = Object.fromEntries(dirty.map((key) => [key, draft[key]]));
    await request("/api/content", { json: { entries } });
    setNote(`Saved ${dirty.length} change${dirty.length === 1 ? "" : "s"}.`);
    router.refresh();
  }

  return (
    <div>
      <div className="sticky top-[72px] z-10 flex items-center gap-6 bg-paper py-4">
        <button onClick={saveAll} disabled={!dirty.length} className="h-12 bg-ink px-8 text-paper label disabled:opacity-40">
          Save {dirty.length ? `(${dirty.length})` : ""}
        </button>
        <button
          className="label text-taupe"
          onClick={async () => {
            if (!confirm("Restore all texts and images to the house defaults?")) return;
            await request("/api/content", { method: "DELETE" });
            setDraft({ ...contentDefaults });
            router.refresh();
          }}
        >
          Reset to defaults
        </button>
        {note ? <span className="text-sm text-taupe">{note}</span> : null}
      </div>
      {contentGroups.map((group) => {
        const keys = Object.keys(contentDefaults).filter((key) => key.startsWith(`${group.id}.`));
        return (
          <section key={group.id} className="mt-12">
            <h2 className="font-serif text-4xl">{group.title}</h2>
            <div className="mt-6 grid gap-8 lg:grid-cols-2">
              {keys.map((key) => (
                <label key={key} className="block text-sm">
                  <span className="label text-taupe">
                    {key.split(".").slice(1).join(" · ")}
                    {isLinkKey(key) ? " (link)" : isImageKey(key) ? " (image)" : ""}
                  </span>
                  {isImageKey(key) ? (
                    <span className="mt-2 flex gap-4">
                      <img src={draft[key]} alt="" className="h-24 w-20 object-cover" />
                      <input className="field" value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
                    </span>
                  ) : isLongKey(key) ? (
                    <textarea className="field mt-2" value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
                  ) : (
                    <input className="field mt-2" value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
                  )}
                </label>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ProductsEditor({ products }: { products: CatalogProduct[] }) {
  const [selected, setSelected] = useState(products[0]?.id ?? 0);
  const product = products.find((item) => item.id === selected);
  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <div className="max-h-[70vh] overflow-y-auto border-r border-line pr-4">
        {products.map((item) => (
          <button key={item.id} onClick={() => setSelected(item.id)} className={`block w-full py-2 text-left text-sm ${selected === item.id ? "text-ink" : "text-taupe"}`}>
            {item.name}
            <span className="block text-[10px] uppercase tracking-[0.2em]">{item.collectionName}</span>
          </button>
        ))}
      </div>
      {product ? <ProductForm key={product.id} product={product} /> : null}
    </div>
  );
}

function ProductForm({ product }: { product: CatalogProduct }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product.name,
    category: product.category,
    price: String(product.price / 100),
    description: product.description,
    materials: product.materials,
    details: product.details,
    featured: product.featured,
    isNew: product.isNew,
    images: product.images.map((image) => ({ url: image.url, kind: image.kind, alt: image.alt })),
  });
  const [note, setNote] = useState("");

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await request("/api/studio/catalog", { json: { type: "product", id: product.id, ...form } });
        setNote("Saved.");
        router.refresh();
      }}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Input label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
        <Input label="Price (EUR)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
        <div className="flex items-end gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} /> New
          </label>
        </div>
      </div>
      <Area label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
      <Area label="Materials" value={form.materials} onChange={(v) => setForm({ ...form, materials: v })} />
      <Area label="Details & fit" value={form.details} onChange={(v) => setForm({ ...form, details: v })} />
      <p className="mt-8 label text-taupe">Images (first is the card image, second shows on hover)</p>
      <div className="mt-4 space-y-4">
        {form.images.map((image, index) => (
          <div key={index} className="grid grid-cols-[64px_1fr_120px_auto] items-center gap-3">
            {image.kind === "video" ? <span className="flex h-20 w-16 items-center justify-center bg-ink text-paper label">Film</span> : <img src={image.url} alt="" className="h-20 w-16 object-cover" />}
            <input className="field text-sm" value={image.url} onChange={(e) => setForm({ ...form, images: form.images.map((img, i) => (i === index ? { ...img, url: e.target.value } : img)) })} />
            <select className="field text-sm" value={image.kind} onChange={(e) => setForm({ ...form, images: form.images.map((img, i) => (i === index ? { ...img, kind: e.target.value } : img)) })}>
              {["model", "product", "detail", "campaign", "video"].map((kind) => (
                <option key={kind}>{kind}</option>
              ))}
            </select>
            <span className="flex gap-3 text-xs">
              <button type="button" disabled={index === 0} onClick={() => setForm({ ...form, images: move(form.images, index, -1) })}>↑</button>
              <button type="button" disabled={index === form.images.length - 1} onClick={() => setForm({ ...form, images: move(form.images, index, 1) })}>↓</button>
              <button type="button" className="text-taupe" onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== index) })}>Remove</button>
            </span>
          </div>
        ))}
        <button type="button" className="label border-b border-ink pb-1" onClick={() => setForm({ ...form, images: [...form.images, { url: "", kind: "model", alt: form.name }] })}>
          Add image
        </button>
      </div>
      <div className="mt-10 flex items-center gap-6">
        <button className="h-12 bg-ink px-8 text-paper label">Save product</button>
        <Link href={`/products/${product.slug}`} className="label text-taupe">View page</Link>
        {note ? <span className="text-sm text-taupe">{note}</span> : null}
      </div>
    </form>
  );
}

function CollectionsEditor({ collections }: { collections: CatalogCollection[] }) {
  return (
    <div className="space-y-16">
      {collections.map((collection) => (
        <CollectionForm key={collection.id} collection={collection} />
      ))}
    </div>
  );
}

function CollectionForm({ collection }: { collection: CatalogCollection }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: collection.name,
    season: collection.season,
    statement: collection.statement,
    story: collection.story,
    heroImage: collection.heroImage,
    secondaryImage: collection.secondaryImage,
    videoUrl: collection.videoUrl ?? "",
  });
  const [note, setNote] = useState("");
  return (
    <form
      className="border-t border-line pt-8"
      onSubmit={async (event) => {
        event.preventDefault();
        await request("/api/studio/catalog", { json: { type: "collection", id: collection.id, ...form } });
        setNote("Saved.");
        router.refresh();
      }}
    >
      <h2 className="font-serif text-4xl">{collection.name}</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Input label="Season" value={form.season} onChange={(v) => setForm({ ...form, season: v })} />
        <Input label="Hero image URL" value={form.heroImage} onChange={(v) => setForm({ ...form, heroImage: v })} />
        <Input label="Secondary image URL" value={form.secondaryImage} onChange={(v) => setForm({ ...form, secondaryImage: v })} />
        <Input label="Campaign film URL (mp4, optional)" value={form.videoUrl} onChange={(v) => setForm({ ...form, videoUrl: v })} />
      </div>
      <Area label="Statement" value={form.statement} onChange={(v) => setForm({ ...form, statement: v })} />
      <Area label="Story" value={form.story} onChange={(v) => setForm({ ...form, story: v })} />
      <div className="mt-8 flex items-center gap-6">
        <button className="h-12 bg-ink px-8 text-paper label">Save collection</button>
        <Link href={`/collections/${collection.slug}`} className="label text-taupe">View page</Link>
        {note ? <span className="text-sm text-taupe">{note}</span> : null}
      </div>
    </form>
  );
}

function ExportPanel({ content }: { content: Record<string, string> }) {
  const json = JSON.stringify(content, null, 2);
  return (
    <div className="max-w-3xl space-y-10 text-sm leading-7 text-charcoal">
      <section>
        <h2 className="font-serif text-4xl text-ink">Open this site in Figma</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5">
          <li>In Figma, run the free plugin <strong>html.to.design</strong> (Resources → Plugins).</li>
          <li>Choose “Import from URL” and paste this site’s address for each page (/, /collections/nocturne, /products/column-gown, /lookbook, /campaign/nocturne, /about).</li>
          <li>Import at desktop (1440) and mobile (390) widths. Every text, button and image arrives as a native, editable Figma layer.</li>
        </ol>
      </section>
      <section>
        <h2 className="font-serif text-4xl text-ink">Open this site in Framer</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5">
          <li>In Framer, create a project and use <strong>Insert → Import from URL</strong> (or the “HTML to Framer” plugin).</li>
          <li>Paste the page URL. Framer rebuilds the layout as editable frames, text and image fills.</li>
        </ol>
      </section>
      <section>
        <h2 className="font-serif text-4xl text-ink">Copy deck</h2>
        <p className="mt-2">All texts, button labels, links and image URLs currently live on the site — paste into Figma or hand to a copywriter.</p>
        <button
          className="mt-4 label border-b border-ink pb-1 text-ink"
          onClick={() => {
            const blob = new Blob([json], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "jonglei-content.json";
            a.click();
          }}
        >
          Download content JSON
        </button>
        <textarea readOnly className="field mt-6 h-72 font-mono text-xs" value={json} />
      </section>
    </div>
  );
}

function move<T>(list: T[], index: number, delta: number) {
  const next = [...list];
  const [item] = next.splice(index, 1);
  next.splice(index + delta, 0, item);
  return next;
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="label text-taupe">{label}</span>
      <input className="field mt-2" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="mt-6 block text-sm">
      <span className="label text-taupe">{label}</span>
      <textarea className="field mt-2" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
