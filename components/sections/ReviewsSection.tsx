"use client";

import { reviewsRow1, reviewsRow2 } from "@/lib/data";
import { ReviewCard } from "@/components/reviews/ReviewCard";

export function ReviewsSection() {
  return (
    <section className="py-24 bg-white text-slate-900 overflow-hidden relative font-lato">
      {/* Degradados laterales blancos para enfoque central */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      <div className="px-6 mb-16 text-center">
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#8CC63F] mb-4 block font-black">
          Nuestros Clientes
        </span>
        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900">
          Ellos ya <span className="text-[#00AEEF]">confían</span>{" "}
          <br className="md:hidden" /> en M&G
        </h3>
      </div>

      <div className="flex flex-col gap-8">
        {/* Fila 1 */}
        <div className="flex overflow-hidden review-row py-4">
          <div className="flex animate-marquee gap-6 whitespace-nowrap">
            {[...reviewsRow1, ...reviewsRow1].map((review, i) => (
              <ReviewCard key={`row1-${i}`} {...review} />
            ))}
          </div>
        </div>

        {/* Fila 2 */}
        <div className="flex overflow-hidden review-row py-4">
          <div className="flex animate-marquee-reverse gap-6 whitespace-nowrap">
            {[...reviewsRow2, ...reviewsRow2].map((review, i) => (
              <ReviewCard key={`row2-${i}`} {...review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
