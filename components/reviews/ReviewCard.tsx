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
  /* W-260px en móvil para que se vean varias tarjetas a la vez */
  <div className="group w-[260px] md:w-[450px] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-slate-100 border-2 border-slate-200 hover:border-[#00AEEF] hover:bg-white hover:shadow-2xl transition-all duration-500 shrink-0 flex flex-col justify-between cursor-pointer">
    <div>
      {/* Comillas un poco más pequeñas en móvil */}
      <span className="text-4xl md:text-6xl font-black text-[#8CC63F] leading-none block mb-3 md:mb-4">
        “
      </span>
      {/* Texto ajustado: text-sm en móvil, text-lg en desktop */}
      <p className="text-sm md:text-lg text-slate-700 leading-relaxed font-semibold italic whitespace-normal mb-6 md:mb-8">
        {text}
      </p>
    </div>

    <div className="flex items-center gap-3 md:gap-4 pt-4 md:pt-6 border-t border-slate-200">
      <div className="relative w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white">
        <Image
          src={img}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          alt={name}
        />
      </div>
      <div className="flex flex-col min-w-0">
        <p className="text-[10px] md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-tight truncate">
          {name}
        </p>
        <p className="text-[8px] md:text-[10px] font-black text-[#00AEEF] uppercase tracking-[0.1em] mt-0.5 truncate">
          {role}
        </p>
      </div>
    </div>
  </div>
);
