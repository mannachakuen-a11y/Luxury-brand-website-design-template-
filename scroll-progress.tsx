"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrolled = doc.scrollTop;
        const total = doc.scrollHeight - doc.clientHeight;
        setVisible(scrolled > 20);
        setProgress(total > 0 ? Math.min(1, scrolled / total) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[45] h-[1px] w-full origin-left bg-ink/70 transition-opacity duration-500"
      style={{ transform: `scaleX(${progress})`, opacity: visible ? 1 : 0 }}
    />
  );
}
