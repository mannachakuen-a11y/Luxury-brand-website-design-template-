"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="px-6 pb-28 pt-40 lg:px-12">
      <p className="label text-taupe">Salon</p>
      <h1 className="mt-4 font-serif text-6xl">A moment, please.</h1>
      <p className="mt-6 max-w-md text-sm leading-7 text-charcoal">The house is briefly unavailable. The cloth is still here.</p>
      <button onClick={reset} className="link-line mt-10">
        Try again
      </button>
    </div>
  );
}
