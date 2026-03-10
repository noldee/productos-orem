"use client";

import { ShoppingBag, Truck, PackageCheck, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

// Cambiamos los iconos para que representen comercio y logística
const ICONS: Record<string, ReactNode> = {
  tienda: <ShoppingBag size={20} strokeWidth={1.5} />,
  abastecimiento: <Truck size={20} strokeWidth={1.5} />,
  mayorista: <PackageCheck size={20} strokeWidth={1.5} />,
};

// Datos internos para que no dependas de archivos externos si no los tienes listos
const storeServices = [
  {
    iconName: "tienda",
    title: "Venta Minorista",
    desc: "Productos de limpieza premium para el cuidado diario de tu hogar con fragancias exclusivas.",
    icon: "tienda",
  },
  {
    iconName: "abastecimiento",
    title: "Abastecimiento Corporativo",
    desc: "Suministro constante de insumos de higiene para oficinas, locales comerciales y empresas.",
    icon: "abastecimiento",
  },
  {
    iconName: "mayorista",
    title: "Venta por Mayor",
    desc: "Precios especiales y stock garantizado para revendedores y proveedores del sector.",
    icon: "mayorista",
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 md:py-32 px-6 bg-crema/30" id="servicios">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4">
          <h2 className="font-serif text-4xl md:text-6xl italic text-stone-900 leading-tight">
            Nuestros <br className="hidden md:block" />
            <span className="not-italic text-stone-300">Suministros</span>
          </h2>
          <div className="flex flex-col items-start md:items-end">
            <p className="font-sans text-stone-400 text-[9px] md:text-[10px] uppercase tracking-[0.3em] pb-2 border-b border-stone-200">
              Distribución y Venta
            </p>
            <p className="font-sans text-stone-400 text-[9px] uppercase tracking-widest mt-2">
              Atención a particulares y proveedores
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {storeServices.map((service, i) => (
            <div
              key={i}
              className="group p-8 md:p-10 rounded-[2rem] bg-white border border-stone-100 hover:border-stone-300 hover:shadow-xl hover:shadow-stone-200/40 transition-all duration-500 flex flex-col items-start"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-stone-50 text-stone-400 group-hover:bg-musgo group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                {ICONS[service.iconName]}
              </div>

              <h4 className="font-serif text-xl md:text-2xl italic mb-3 text-stone-800">
                {service.title}
              </h4>

              <p className="font-sans text-stone-500 font-light text-sm leading-relaxed mb-8 flex-1">
                {service.desc}
              </p>

              <button className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2 text-stone-400 group-hover:text-musgo transition-all">
                Consultar Catálogo
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
