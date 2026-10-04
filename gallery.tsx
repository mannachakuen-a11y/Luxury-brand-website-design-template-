"use client";

import { useEffect, useState } from "react";
import type { CatalogImage } from "@/lib/types";

export function Gallery({ images, name }: { images: CatalogImage[]; name: string }) {
  const slides = images.filter((image) => image.url);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const current = slides[index] ?? slides[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") setIndex((value) => (value + 1) % slides.length);
      if (event.key === "ArrowLeft") setIndex((value) => (value - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, slides.length]);

  if (!current) return null;

  function frame(slide: CatalogImage, className: string, play = false) {
    if (slide.kind === "video") {
      const poster = slides.find((item) => item.kind !== "video")?.url;
      if (!play) {
        return (
          <span className={`relative block bg-ink ${className}`}>
            {poster ? <img src={poster} alt="" className="h-full w-full object-cover grade opacity-80" /> : null}
            <span className="absolute inset-0 flex items-center justify-center label text-paper">Film</span>
          </span>
        );
      }
      return <video src={slide.url} className={className} autoPlay muted loop playsInline poster={poster} />;
    }
    return <img src={slide.url} alt={slide.alt || name} className={`${className} grade`} />;
  }

  return (
    <div>
      <div className="snap-gallery flex overflow-x-auto lg:hidden">
        {slides.map((slide, slideIndex) => (
          <button
            key={`${slide.url}-${slideIndex}`}
            className="min-w-full"
            onClick={() => {
              setIndex(slideIndex);
              setOpen(true);
            }}
          >
            {frame(slide, "aspect-[3/4] w-full object-cover", false)}
          </button>
        ))}
      </div>

      <div className="hidden lg:grid lg:grid-cols-[88px_1fr] lg:gap-4">
        <div className="flex flex-col gap-3">
          {slides.map((slide, slideIndex) => (
            <button
              key={`${slide.url}-thumb-${slideIndex}`}
              onClick={() => setIndex(slideIndex)}
              className={slideIndex === index ? "opacity-100" : "opacity-45 hover:opacity-80"}
              aria-label={`View image ${slideIndex + 1}`}
            >
              {slide.kind === "video" ? (
                <span className="flex aspect-[3/4] items-center justify-center bg-ink text-paper label">Film</span>
              ) : (
                <img src={slide.url} alt="" className="aspect-[3/4] w-full object-cover grade" />
              )}
            </button>
          ))}
        </div>
        <div
          className="relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-ivory text-left"
          onMouseEnter={() => current.kind !== "video" && setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setOrigin(`${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`);
          }}
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter") setOpen(true);
          }}
          aria-label="Open gallery"
        >
          {current.kind === "video" ? (
            frame(current, "h-full w-full object-cover", true)
          ) : (
            <img
              src={current.url}
              alt={current.alt || name}
              className="h-full w-full object-cover grade transition duration-700 ease-out"
              style={{ transform: zoom ? "scale(1.65)" : "scale(1)", transformOrigin: origin }}
            />
          )}
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] flex flex-col bg-ink text-paper">
          <div className="flex items-center justify-between px-6 py-5">
            <p className="label">{name}</p>
            <button onClick={() => setOpen(false)} className="label">
              Close
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-6">
            <button
              className="absolute left-4 label lg:left-8"
              onClick={() => setIndex((value) => (value - 1 + slides.length) % slides.length)}
              aria-label="Previous image"
            >
              Prev
            </button>
            <div className="h-full max-h-full w-full max-w-5xl">
              {frame(current, "mx-auto h-full max-h-[72vh] w-full object-contain", true)}
            </div>
            <button
              className="absolute right-4 label lg:right-8"
              onClick={() => setIndex((value) => (value + 1) % slides.length)}
              aria-label="Next image"
            >
              Next
            </button>
          </div>
          <div className="flex justify-center gap-3 overflow-x-auto px-6 py-5">
            {slides.map((slide, slideIndex) => (
              <button key={`${slide.url}-full-${slideIndex}`} onClick={() => setIndex(slideIndex)} className={slideIndex === index ? "" : "opacity-40"}>
                {slide.kind === "video" ? (
                  <span className="label">Film</span>
                ) : (
                  <img src={slide.url} alt="" className="h-16 w-12 object-cover" />
                )}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
