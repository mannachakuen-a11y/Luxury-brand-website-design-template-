"use client";

export function Marquee({ text, speed = 45 }: { text: string; speed?: number }) {
  const items = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-line py-6" aria-hidden="true">
      <div
        className="inline-flex min-w-full items-center gap-10 font-serif text-[clamp(3rem,7vw,5.5rem)] italic leading-none tracking-[-0.03em] marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        {items.map((i) => (
          <span key={i} className="flex items-center gap-10">
            <span>{text}</span>
            <span className="text-taupe/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
