"use client";

import { reviewsRow1, reviewsRow2 } from "@/lib/data";
import { ReviewCard } from "@/components/reviews/ReviewCard";

export function ReviewsSection() {
  return (
    <section className="py-24 bg-white overflow-hidden relative font-lato">
      {/* Fades laterales */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-white via-white/80 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-white via-white/80 to-transparent z-20" />

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

      <div className="flex flex-col gap-10">
        {/* FILA 1 — izquierda */}
        <div className="marquee-wrapper group">
          <div className="marquee-track marquee-left">
            {[...reviewsRow1, ...reviewsRow1].map((r, i) => (
              <div key={`r1-${i}`} className="shrink-0">
                <ReviewCard {...r} />
              </div>
            ))}
          </div>
        </div>

        {/* FILA 2 — derecha */}
        <div className="marquee-wrapper group">
          <div className="marquee-track marquee-right">
            {[...reviewsRow2, ...reviewsRow2].map((r, i) => (
              <div key={`r2-${i}`} className="shrink-0">
                <ReviewCard {...r} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
