"use client";

import { useEffect, useRef } from "react";

/**
 * Editorial letter-mask reveal.
 * Letters slide up into view with a staggered delay, wrapped by a clip-path mask
 * so the baseline stays clean. Used on hero titles, section headings, quotes.
 */
export function MotionText({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  split = "words",
}: {
  text: string;
  as?: React.ElementType;
  className?: string;
  delay?: number;
  split?: "words" | "chars";
}) {
  const ref = useRef<HTMLElement>(null);
  const units = split === "chars" ? text.split("") : text.split(" ");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.dataset.motion = "done";
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) node.dataset.motion = "done";
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`motion-text ${className}`}
      style={{ "--motion-delay": `${delay}ms` } as React.CSSProperties}
      aria-label={text}
    >
      {units.map((unit, index) => (
        <span
          key={index}
          className="motion-unit"
          style={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error inline custom property
            "--i": index,
          }}
        >
          <span className="motion-line">{unit === " " ? "\u00A0" : unit}</span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Slow, editorial Ken Burns on the element — scale + translate drifts while visible.
 */
export function SlowZoom({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`slow-zoom ${className}`}>
      <div className="slow-zoom__inner">{children}</div>
    </div>
  );
}
