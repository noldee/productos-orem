"use client";

import Image from "next/image";

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
  <div className="group w-[280px] md:w-[400px] p-6 md:p-8 rounded-[2rem] bg-stone-900/40 border border-stone-800/50 hover:border-salvia/30 hover:bg-stone-900 transition-all duration-700 shrink-0 flex flex-col justify-between">
    {/* Contenido del Testimonio */}
    <p className="font-sans text-sm md:text-base text-stone-300 leading-relaxed italic whitespace-normal mb-8">
      {`"${text}"`}
    </p>

    {/* Info del Usuario */}
    <div className="flex items-center gap-4">
      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 ring-1 ring-stone-800 group-hover:ring-salvia/40 transition-all duration-500">
        <Image
          src={img}
          fill
          className="object-cover grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100 transition-all duration-700"
          alt={name}
        />
      </div>
      <div>
        <p className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white">
          {name}
        </p>
        <p className="font-serif text-[10px] md:text-xs italic text-stone-500 group-hover:text-salvia/60 transition-colors">
          {role}
        </p>
      </div>
    </div>
  </div>
);
