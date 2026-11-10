"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Slide = {
  imageUrl: string;
  title: string;
  caption: string;
};

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % slides.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="grid h-[46vh] place-items-center bg-ink-800 text-sm text-white/40">
        Lab photographs will appear here.
      </div>
    );
  }

  const safeIndex = index % slides.length;

  const move = (step: number) =>
    setIndex((value) => (value + step + slides.length) % slides.length);

  return (
    <div
      className="relative isolate h-[54vh] min-h-[320px] overflow-hidden bg-ink-900 sm:h-[62vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, slideIndex) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${slide.imageUrl}-${slideIndex}`}
          src={slide.imageUrl}
          alt={slide.title || "Laboratory photograph"}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            slideIndex === safeIndex ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/35 to-ink-950/10" />

      <div className="wrap relative flex h-full flex-col justify-end pb-10">
        <div key={safeIndex} className="animate-fade max-w-2xl">
          {slides[safeIndex].title && (
            <p className="eyebrow text-brand-300">{slides[safeIndex].title}</p>
          )}
          {slides[safeIndex].caption && (
            <p className="font-display mt-2 max-w-xl text-[1.5rem] font-medium leading-snug text-white sm:text-[2rem]">
              {slides[safeIndex].caption}
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slides.map((slide, dotIndex) => (
              <button
                key={`${slide.imageUrl}-dot-${dotIndex}`}
                type="button"
                onClick={() => setIndex(dotIndex)}
                aria-label={`Go to slide ${dotIndex + 1}`}
                aria-current={dotIndex === safeIndex ? "true" : undefined}
                className={cn(
                  "h-[3px] transition-all",
                  dotIndex === safeIndex
                    ? "w-8 bg-brand-400"
                    : "w-4 bg-white/35 hover:bg-white/60",
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous slide"
              className="grid h-9 w-9 place-items-center border border-white/25 text-white/75 transition-colors hover:border-brand-300 hover:text-brand-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next slide"
              className="grid h-9 w-9 place-items-center border border-white/25 text-white/75 transition-colors hover:border-brand-300 hover:text-brand-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
