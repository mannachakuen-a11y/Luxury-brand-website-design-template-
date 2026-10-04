import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-6 pb-28 pt-40 lg:px-12">
      <p className="label text-taupe">404</p>
      <h1 className="mt-4 max-w-3xl font-serif text-6xl leading-[0.9] lg:text-8xl">This page has left the atelier.</h1>
      <Link href="/" className="link-line mt-10">
        Return home
      </Link>
    </div>
  );
}
