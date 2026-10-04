import { getCatalog } from "@/lib/queries";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const { products } = await getCatalog();
  const product = products.find((item) => item.slug === slug);
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ product });
}
