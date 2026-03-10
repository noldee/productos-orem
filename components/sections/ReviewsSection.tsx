import { reviewsRow1, reviewsRow2 } from "@/lib/data";
import { ReviewCard } from "@/components/reviews/ReviewCard";

export function ReviewsSection() {
  return (
    <section className="py-24 bg-stone-950 text-white overflow-hidden relative">
      {/* Degradados laterales */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-48 bg-gradient-to-r from-stone-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-48 bg-gradient-to-l from-stone-950 to-transparent z-10 pointer-events-none" />

      <div className="px-6 mb-16 text-center">
        <span className="sans text-[10px] uppercase tracking-[0.4em] text-salvia mb-4 block">
          Testimonios
        </span>
        <h3 className="serif text-4xl md:text-5xl italic">
          Lo que dicen de nosotros
        </h3>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex overflow-hidden review-row py-4">
          <div className="flex animate-marquee gap-6 whitespace-nowrap">
            {[...reviewsRow1, ...reviewsRow1].map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </div>
        </div>

        <div className="flex overflow-hidden review-row py-4">
          <div className="flex animate-marquee-reverse gap-6 whitespace-nowrap">
            {[...reviewsRow2, ...reviewsRow2].map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
