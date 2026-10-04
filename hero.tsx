"use client";

import { useEffect, useRef } from "react";
import { Img, L, T } from "@/components/editable";
import { MotionText } from "@/components/motion-text";
import { VideoHero } from "@/components/video-hero";

export function Hero({
  prefix,
  image,
  video,
  label,
  title,
  href,
  cta,
  sideNote,
}: {
  prefix: string;
  image: string;
  video?: string;
  label: string;
  title: string;
  href: string;
  cta: string;
  sideNote: string;
}) {
  const media = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const node = media.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      const parent = node.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const shift = Math.min(Math.max(-rect.top, 0), rect.height) * 0.22;
      node.style.transform = `translate3d(0, ${shift}px, 0) scale(1.08)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="relative h-[100svh] overflow-hidden bg-ink text-paper">
      {video ? (
        <VideoHero src={video} poster={image} className="absolute inset-0 h-full w-full" />
      ) : (
        <Img
          k={`${prefix}.image`}
          imgRef={media}
          src={image}
          className="absolute inset-0 h-full w-full object-cover grade will-change-transform"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/30" />
      <p className="absolute left-6 top-1/2 hidden -translate-y-1/2 text-paper/70 label [writing-mode:vertical-rl] rotate-180 lg:block">
        <T k="brand.sideNote" value={sideNote} />
      </p>
      <div className="absolute inset-x-0 bottom-0 px-6 pb-12 lg:px-12 lg:pb-16">
        <div className="hero-stagger" style={{ "--i": 0 } as React.CSSProperties}>
          <T k={`${prefix}.label`} value={label} as="p" className="label text-paper/80" />
        </div>
        <MotionText
          as="h1"
          text={title}
          className="hero-title mt-3 font-serif text-[clamp(5rem,14vw,12rem)] italic leading-[0.82] tracking-[-0.04em]"
          delay={280}
          split="words"
        />
        <div className="hero-stagger mt-10" style={{ "--i": 3 } as React.CSSProperties}>
          <L labelKey={`${prefix}.cta`} hrefKey={`${prefix}.href`} label={cta} href={href} className="link-line text-paper" />
        </div>
      </div>
      <div className="hero-scroll absolute bottom-4 right-6 hidden lg:block label text-paper/60">Scroll</div>
    </section>
  );
}
