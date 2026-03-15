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
  <div className="px-3 shrink-0 w-[300px] md:w-[400px]">
    <div
      className="group/card h-full flex flex-col justify-between
      p-6 md:p-8 rounded-3xl
      bg-slate-50 border-2 border-slate-200
      hover:border-[#00AEEF] hover:bg-white hover:shadow-[0_20px_40px_rgba(0,174,239,0.12)]
      transition-all duration-500 cursor-pointer"
    >
      <div>
        <span className="text-5xl md:text-6xl font-black text-[#8CC63F] leading-none block mb-3">
          "
        </span>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-semibold italic whitespace-normal mb-6">
          {text}
        </p>
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden shrink-0 shadow border-2 border-white">
          <Image
            src={img}
            fill
            className="object-cover grayscale group-hover/card:grayscale-0 transition-all duration-700"
            alt={name}
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-tighter text-slate-900 truncate">
            {name}
          </p>
          <p className="text-[9px] md:text-[10px] font-black text-[#00AEEF] uppercase tracking-wider mt-0.5 truncate">
            {role}
          </p>
        </div>
      </div>
    </div>
  </div>
);
