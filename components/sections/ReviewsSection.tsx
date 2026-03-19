"use client";
import { reviewsRow1, reviewsRow2 } from "@/lib/data";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { useState } from "react";

const allReviews = [...reviewsRow1, ...reviewsRow2];
const col1 = allReviews.slice(0, Math.ceil(allReviews.length / 3));
const col2 = allReviews.slice(
  Math.ceil(allReviews.length / 3),
  Math.ceil((allReviews.length * 2) / 3),
);
const col3 = allReviews.slice(Math.ceil((allReviews.length * 2) / 3));

// Columna vertical — desktop
const ScrollColumn = ({
  reviews,
  duration,
  reverse = false,
}: {
  reviews: { name: string; role: string; text: string; img: string }[];
  duration: number;
  reverse?: boolean;
}) => (
  <div className="scroll-col flex-1 overflow-hidden relative">
    <div
      className={`flex flex-col ${reverse ? "scroll-reverse" : "scroll-forward"}`}
      style={{ "--duration": `${duration}s` } as React.CSSProperties}
    >
      {[...reviews, ...reviews, ...reviews].map((r, i) => (
        <ReviewCard key={i} {...r} />
      ))}
    </div>
  </div>
);

// Fila horizontal — mobile
const ScrollRow = ({
  reviews,
  reverse = false,
}: {
  reviews: { name: string; role: string; text: string; img: string }[];
  reverse?: boolean;
}) => {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="overflow-hidden w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        className={`flex gap-4 w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {[...reviews, ...reviews, ...reviews].map((r, i) => (
          <div key={i} className="w-[280px] shrink-0">
            <ReviewCard {...r} />
          </div>
        ))}
      </div>
    </div>
  );
};

export function ReviewsSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden font-lato">
      {/* Header */}
      <div className="px-6 mb-16 text-center">
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#8CC63F] mb-4 block font-black">
          Nuestros Clientes
        </span>
        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-tight">
          Ellos ya <span className="text-[#00AEEF]">confían</span>{" "}
          <br className="md:hidden" /> en M&G
        </h3>
      </div>

      {/* ── MOBILE: 2 filas horizontales ── */}
      <div className="md:hidden flex flex-col gap-4 relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
        <ScrollRow reviews={[...col1, ...col2]} />
        <ScrollRow reviews={[...col2, ...col3]} reverse />
      </div>

      {/* ── DESKTOP: 3 columnas verticales ── */}
      <div className="hidden md:block relative px-6 max-w-6xl mx-auto">
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent z-10" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
        <div
          className="grid grid-cols-3 gap-4"
          style={{ height: 600, overflow: "hidden" }}
        >
          <ScrollColumn reviews={col1} duration={15} />
          <ScrollColumn reviews={col2} duration={17} reverse />
          <ScrollColumn reviews={col3} duration={14} />
        </div>
      </div>
    </section>
  );
}
