"use client";

import { useEffect, useState } from "react";

export function LookbookIndex({ count }: { count: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-frame]"));
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const next = nodes.indexOf(visible.target as HTMLElement);
        if (next >= 0) setIndex(next);
      },
      { threshold: 0.55 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <p className="pointer-events-none fixed bottom-6 right-6 z-30 label text-paper mix-blend-difference">
      {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
    </p>
  );
}
