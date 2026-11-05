"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type Slide = {
  imageUrl: string;
  title: string;
  caption: string;
};

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => {
      if (slides.length === 0) return;
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (!playing || slides.length < 2) return;
    timer.current = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="absolute inset-0 bg-ink-950">
        <div className="grid-tech absolute inset-0 opacity-60" />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Laboratory highlights"
    >
      {slides.map((slide, slideIndex) => (
        <div
          key={slide.imageUrl + slideIndex}
          aria-hidden={slideIndex !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1200ms] ease-out",
            slideIndex === index ? "opacity-100" : "opacity-0",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.imageUrl}
            alt={slide.title || "NCDL laboratory"}
            className={cn(
              "h-full w-full object-cover transition-transform duration-[9000ms] ease-linear",
              slideIndex === index ? "scale-105" : "scale-100",
            )}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/92 to-ink-950/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40" />

      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="wrap flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-lg text-[12.5px] leading-relaxed text-white/60">
            <span className="eyebrow mr-2 text-brand-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            {slides[index]?.caption || slides[index]?.title}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {slides.map((slide, slideIndex) => (
                <button
                  key={slide.imageUrl + slideIndex}
                  type="button"
                  onClick={() => go(slideIndex)}
                  aria-label={`Show slide ${slideIndex + 1}`}
                  aria-current={slideIndex === index}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    slideIndex === index
                      ? "w-7 bg-brand-300"
                      : "w-1.5 bg-white/35 hover:bg-white/60",
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/35 hover:text-white"
              >
                {playing ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
              </button>
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous slide"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/35 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next slide"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/35 hover:text-white"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
