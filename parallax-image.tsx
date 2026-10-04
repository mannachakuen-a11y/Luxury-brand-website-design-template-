"use client";

import { useEffect, useRef } from "react";
import { Img } from "@/components/editable";

export function ParallaxImage({
  k,
  src,
  alt,
  className = "",
}: {
  k?: string;
  src: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      const parent = node.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = (view - rect.top) / (view + rect.height);
      const y = (progress - 0.5) * 70;
      node.style.transform = `translate3d(0, ${y}px, 0) scale(1.12)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const classes = `h-full w-full object-cover grade will-change-transform ${className}`;
  if (k) return <Img k={k} imgRef={ref} src={src} alt={alt} className={classes} />;
  return <img ref={ref} src={src} alt={alt} className={classes} />;
}
