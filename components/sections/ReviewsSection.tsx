"use client";

import { reviewsRow1, reviewsRow2 } from "@/lib/data";
import { ReviewCard } from "@/components/reviews/ReviewCard";

export function ReviewsSection() {
  return (
    <section className="py-24 bg-white overflow-hidden relative font-lato">
      {/* Fades laterales */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white to-transparent z-10" />

      {/* Header */}
      <div className="px-6 mb-16 text-center">
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#8CC63F] mb-4 block font-black">
          Nuestros Clientes
        </span>
        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-tight">
          Ellos ya <span className="text-[#00AEEF]">confían</span>
          <br className="md:hidden" /> en M&G
        </h3>
      </div>

      {/* Filas */}
      <div className="flex flex-col gap-8">
        {/* Fila 1 */}
        <div className="overflow-hidden py-2 review-row">
          <div className="flex w-max animate-marquee">
            {[...reviewsRow1, ...reviewsRow1].map((r, i) => (
              <ReviewCard key={`r1-${i}`} {...r} />
            ))}
          </div>
        </div>

        {/* Fila 2 */}
        <div className="overflow-hidden py-2 review-row">
          <div className="flex w-max animate-marquee-reverse">
            {[...reviewsRow2, ...reviewsRow2].map((r, i) => (
              <ReviewCard key={`r2-${i}`} {...r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
