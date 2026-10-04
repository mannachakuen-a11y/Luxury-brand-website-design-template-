import { cache } from "react";
import { cookies } from "next/headers";
import { pool } from "@/db";
import { ensureCatalog } from "@/db/ensure";
import { contentDefaults } from "@/lib/content-defaults";

export const STUDIO_COOKIE = "sevre_studio";

export function studioPassword() {
  return process.env.STUDIO_PASSWORD || "atelier";
}

export async function ensureContentTable() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS site_content (
      key text PRIMARY KEY,
      value text NOT NULL,
      updated_at timestamp NOT NULL DEFAULT now()
    )`,
  );
}

export const getContent = cache(async () => {
  await ensureCatalog();
  await ensureContentTable();
  const result = await pool.query<{ key: string; value: string }>("select key, value from site_content");
  const merged: Record<string, string> = { ...contentDefaults };
  for (const row of result.rows) merged[row.key] = row.value;
  const c = (key: string) => merged[key] ?? contentDefaults[key] ?? "";
  return { c, all: merged };
});

export async function saveContent(entries: Record<string, string>) {
  await ensureContentTable();
  for (const [key, value] of Object.entries(entries)) {
    if (!(key in contentDefaults) && !key.startsWith("custom.")) continue;
    await pool.query(
      `insert into site_content (key, value, updated_at) values ($1, $2, now())
       on conflict (key) do update set value = excluded.value, updated_at = now()`,
      [key, value],
    );
  }
}

export async function resetContent(key?: string) {
  await ensureContentTable();
  if (key) await pool.query("delete from site_content where key = $1", [key]);
  else await pool.query("delete from site_content");
}

export async function isEditing() {
  const jar = await cookies();
  return jar.get(STUDIO_COOKIE)?.value === studioPassword();
}

export function parseNav(value: string) {
  return value
    .split("\n")
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
    .map(([label, href]) => ({ label, href }));
}
