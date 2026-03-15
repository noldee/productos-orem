"use client";
import Image from "next/image";
import { Star } from "lucide-react";

interface ReviewCardProps {
  name: string;
  role: string;
  text: string;
  img: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  name,
  role,
  text,
  img,
}) => (
  <article className="px-4 shrink-0 w-[320px] md:w-[380px] group/card">
    <div className="bg-[color:var(--color-card)]/90 border-2 border-slate-100 rounded-[3rem] p-8 md:p-10 text-center  hover:shadow hover:border-terracota/30 transition-all duration-500 flex flex-col items-center h-full">
      {/* Imagen Circular */}
      <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 shadow-md border-4 border-crema group-hover/card:scale-110 transition-transform duration-500">
        <Image src={img} fill className="object-cover" alt={name} />
      </div>

      <h3 className="text-negro font-black uppercase tracking-tighter text-lg mb-4">
        {name}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex gap-1 text-musgo">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill="currentColor" stroke="none" />
          ))}
        </div>
        <span className="font-black text-slate-400 text-sm">5.0</span>
      </div>

      <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium italic mb-6">
        &ldquo;{text}&rdquo;
      </p>

      <span className="text-[10px] font-black text-terracota uppercase tracking-[0.2em] mt-auto">
        {role}
      </span>
    </div>
  </article>
);
