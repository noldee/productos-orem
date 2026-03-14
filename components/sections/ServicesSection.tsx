"use client";

import {
  ShoppingBag,
  Home,
  Building2,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import type { ReactNode } from "react";

// Iconos representativos para Hogar, Negocio y Empresa
const ICONS: Record<string, ReactNode> = {
  casa: <Home size={20} strokeWidth={1.5} />,
  negocio: <ShoppingBag size={20} strokeWidth={1.5} />,
  empresa: <Building2 size={20} strokeWidth={1.5} />,
};

const storeServices = [
  {
    iconName: "casa",
    title: "Para su Casa",
    desc: "Variedad de productos esenciales para mantener la higiene y el bienestar de tu hogar.",
    items: ["Lavandina", "Detergentes", "Suavizantes para ropa"],
  },
  {
    iconName: "negocio",
    title: "Para su Negocio",
    desc: "Suministros de limpieza con la mejor relación calidad-precio para emprendedores.",
    items: ["Limpiador de vidrios", "Desinfectantes", "Limpiador de pisos"],
  },
  {
    iconName: "empresa",
    title: "Para su Empresa",
    desc: "Soluciones integrales de desinfección y limpieza a gran escala con stock garantizado.",
    items: [
      "Limpiador anti-bacteriano",
      "Limpiador de toilets",
      "Ventas al por mayor",
    ],
  },
];

export function ServicesSection() {
  return (
    <section
      className="py-20 md:py-32 px-6 bg-[#f8fafc] font-lato"
      id="servicios"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.85] uppercase tracking-tighter">
            Nuestros <br className="hidden md:block" />
            <span className="text-[#00AEEF]">Servicios</span>
          </h2>
          <div className="flex flex-col items-start md:items-end">
            <p className="text-[#8CC63F] text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-bold pb-2 border-b border-slate-200">
              M&G S.A.C. Servicios Generales
            </p>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-2 font-medium">
              Ventas al por mayor y menor
            </p>
          </div>
        </div>

        {/* Grid de Servicios Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {storeServices.map((service, i) => (
            <div
              key={i}
              className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-[#00AEEF]/30 hover:shadow-2xl hover:shadow-[#00AEEF]/10 transition-all duration-500 flex flex-col"
            >
              <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-[#00AEEF] group-hover:text-white transition-all duration-500 group-hover:rotate-3">
                {ICONS[service.iconName]}
              </div>

              <h4 className="text-2xl font-black mb-3 text-slate-800 uppercase tracking-tight">
                {service.title}
              </h4>

              <p className="text-slate-500 font-light text-sm leading-relaxed mb-6">
                {service.desc}
              </p>

              <ul className="space-y-2 mb-8 flex-1">
                {service.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider"
                  >
                    <CheckCircle2 size={12} className="text-[#8CC63F]" />
                    {item}
                  </li>
                ))}
              </ul>

              <button className="text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2 text-[#00AEEF] group-hover:gap-4 transition-all">
                Saber más
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Lista completa extraída del PPT */}
        <div className="bg-[#00AEEF] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20" />

          <h3 className="text-2xl md:text-3xl font-black uppercase mb-8 relative z-10">
            Variedad de Productos de Limpieza General
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 relative z-10">
            {[
              "Lavandina",
              "Limpiador de toilets",
              "Productos desinfectantes",
              "Limpiador anti-bacteriano",
              "Limpiador de vidrios",
              "Limpiador de pisos",
              "Detergentes de ropa",
              "Suavizante para ropas",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-b border-white/20 pb-2"
              >
                <span className="w-1.5 h-1.5 bg-[#8CC63F] rounded-full" />
                <span className="text-sm font-bold uppercase tracking-wide">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
