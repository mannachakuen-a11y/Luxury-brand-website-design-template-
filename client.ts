export async function request(url: string, init?: { method?: string; json?: unknown }) {
  const response = await fetch(url, {
    method: init?.method ?? "POST",
    headers: { "Content-Type": "application/json" },
    body: init?.json === undefined ? undefined : JSON.stringify(init.json),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Please try again.");
  }
  return data as Record<string, unknown>;
}
