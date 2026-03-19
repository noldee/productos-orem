"use client";
import Image from "next/image";
import { Star } from "lucide-react";

interface ReviewCardProps {
  name: string;
  role: string;
  text: string;
  img: string;
}

export const ReviewCard = ({ name, role, text, img }: ReviewCardProps) => (
  <article className="w-full mb-4">
    <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col gap-3 hover:border-[#00AEEF]/30 hover:shadow-lg hover:shadow-[#00AEEF]/5 transition-all duration-500">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 flex-shrink-0">
          <Image src={img} fill className="object-cover" alt={name} />
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-slate-900 text-sm tracking-tight truncate">
            {name}
          </h3>
          <p className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-widest truncate">
            {role}
          </p>
        </div>
      </div>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} className="text-[#8CC63F]" fill="#8CC63F" />
        ))}
      </div>
      <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
        &ldquo;{text}&rdquo;
      </p>
    </div>
  </article>
);
