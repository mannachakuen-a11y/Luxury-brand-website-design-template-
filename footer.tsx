import Link from "next/link";
import { T } from "@/components/editable";
import { NewsletterForm } from "@/components/newsletter-form";

export function Footer({ content }: { content: Record<string, string> }) {
  const c = (key: string) => content[key] ?? "";
  return (
    <footer className="border-t border-line bg-paper px-6 pb-8 pt-16 text-ink lg:px-12">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <T k="footer.title" value={c("footer.title")} as="p" className="font-serif text-4xl italic" />
          <T k="footer.body" value={c("footer.body")} as="p" className="mt-4 block max-w-sm text-sm leading-7 text-charcoal" />
          <div className="mt-8">
            <NewsletterForm label={c("footer.newsletterLabel")} button={c("footer.newsletterButton")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 lg:col-span-7">
          <div className="space-y-3">
            <p className="label text-taupe">Collections</p>
            <Link className="block" href="/collections/nocturne">Nocturne</Link>
            <Link className="block" href="/collections/jardin-blanc">Jardin Blanc</Link>
            <Link className="block" href="/collections/rue">Rue</Link>
            <Link className="block" href="/shop">All pieces</Link>
          </div>
          <div className="space-y-3">
            <p className="label text-taupe">The house</p>
            <Link className="block" href="/about">About</Link>
            <Link className="block" href="/lookbook">Lookbook</Link>
            <Link className="block" href="/campaign/nocturne">Campaign</Link>
            <Link className="block" href="/contact">Contact</Link>
          </div>
          <div className="space-y-3">
            <p className="label text-taupe">Services</p>
            <Link className="block" href="/client-services">Shipping & returns</Link>
            <Link className="block" href="/size-guide">Size guide</Link>
            <Link className="block" href="/account">Account</Link>
            <Link className="block" href="/privacy">Privacy</Link>
            <Link className="block" href="/terms">Terms</Link>
            <Link className="block text-taupe" href="/studio">Studio</Link>
          </div>
        </div>
      </div>
      <p className="mt-16 overflow-hidden text-center font-serif text-[18vw] leading-[0.8] tracking-[-0.05em]">
        <T k="brand.wordmark" value={c("brand.wordmark")} />
      </p>
      <div className="mt-6 flex flex-col gap-2 text-xs tracking-wide text-taupe sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {c("brand.name")}. All rights reserved.</p>
        <T k="footer.city" value={c("footer.city")} as="p" />
      </div>
    </footer>
  );
}
