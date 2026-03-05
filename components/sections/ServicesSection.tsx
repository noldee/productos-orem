import { Leaf, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";
import { services } from "@/lib/data";
import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  leaf: <Leaf size={20} />,
  shield: <ShieldCheck size={20} />,
  sparkles: <Sparkles size={20} />,
};

export function ServicesSection() {
  return (
    <section className="py-20 md:py-32 px-6 bg-[#FCFBF9]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4">
          <h2 className="serif text-4xl md:text-6xl italic text-stone-900 leading-tight">
            Soluciones <br className="hidden md:block" />
            <span className="not-italic text-stone-300">a medida</span>
          </h2>
          <p className="sans text-stone-400 text-[9px] md:text-[10px] uppercase tracking-[0.3em] pb-2 border-b border-stone-100">
            Servicios Exclusivos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className="group p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] bg-white border border-stone-100 hover:border-stone-300 hover:shadow-md hover:shadow-stone-100/80 transition-all duration-500"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 mb-6 flex items-center justify-center rounded-full bg-stone-50 text-stone-400">
                {ICONS[service.iconName]}
              </div>
              <h4 className="serif text-xl md:text-2xl italic mb-3 text-stone-800">
                {service.title}
              </h4>
              <p className="sans text-stone-500 font-light text-xs md:text-sm leading-relaxed mb-6">
                {service.desc}
              </p>
              <button className="sans text-[9px] uppercase tracking-widest font-bold flex items-center gap-2 text-stone-400 group-hover:text-musgo transition-colors">
                Saber más <ChevronRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}