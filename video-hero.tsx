"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic video hero. Muted, looped, plays only when visible.
 * Slow Ken-Burns zoom is applied via CSS on the wrapper.
 */
export function VideoHero({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const wrap = wrapper.current;
    if (!node || !wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.play().catch(() => undefined);
          wrap.dataset.playing = "true";
        } else {
          node.pause();
          wrap.dataset.playing = "false";
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapper} className={`video-hero ${className}`}>
      <video
        ref={ref}
        className="video-hero__media"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    </div>
  );
}
