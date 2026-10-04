import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bodoni_Moda, Outfit } from "next/font/google";
import { EditProvider, StudioBar } from "@/components/editable";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollProgress } from "@/components/scroll-progress";
import { ensureCatalog } from "@/db/ensure";
import { getContent, isEditing, parseNav } from "@/lib/content";
import { getHeaderState } from "@/lib/queries";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JONGLEI — Paris",
    template: "%s — JONGLEI",
  },
  description:
    "Jonglei, Paris. Evening, tailoring and leather, cut in the atelier since 1924. Autumn / Winter 2026: Nocturne.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: ReactNode }) {
  let bag = 0;
  let wish = 0;
  let customerName: string | null = null;
  let editing = false;
  let content: Record<string, string> = {};
  try {
    await ensureCatalog();
    const [header, edit, { all }] = await Promise.all([getHeaderState(), isEditing(), getContent()]);
    bag = header.bag;
    wish = header.wish;
    customerName = header.customerName;
    editing = edit;
    content = all;
  } catch (error) {
    console.error(error);
  }

  return (
    <html lang="en" className={`${outfit.variable} ${bodoni.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-paper font-sans text-ink antialiased">
        <EditProvider editing={editing}>
          <ScrollProgress />
          <Header
            bag={bag}
            wish={wish}
            customerName={customerName}
            wordmark={content["brand.wordmark"] ?? "JONGLEI"}
            nav={parseNav(content["nav.links"] ?? "")}
            menuImage={content["nav.menuImage"] ?? ""}
            menuLabel={content["nav.menuLabel"] ?? ""}
            menuTitle={content["nav.menuTitle"] ?? ""}
          />
          <main>{children}</main>
          <Footer content={content} />
          <StudioBar />
        </EditProvider>
      </body>
    </html>
  );
}
