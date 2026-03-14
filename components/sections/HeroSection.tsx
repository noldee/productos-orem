"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 md:pt-28 lg:pt-16 px-6 overflow-hidden bg-white font-lato">
      {/* Luces de fondo con los nuevos colores corporativos */}
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-[#00AEEF]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-[#8CC63F]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-10 items-center relative z-0">
        {/* BLOQUE DE TEXTO */}
        <motion.div
          className="lg:col-span-7 mt-8 md:mt-12 lg:mt-0 flex flex-col justify-center"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-slate-400 mb-6 md:mb-8 block font-bold">
            Soluciones en Limpieza — Lima 2026
          </span>

          <h1 className="font-black text-[11vw] md:text-[9vw] lg:text-[7.5vw] leading-[0.82] mb-10 text-slate-900 tracking-tighter uppercase">
            Calidad <br /> en cada{" "}
            <span className="text-[#00AEEF] not-italic">rincón</span> <br /> de
            tu hogar.
          </h1>

          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <Link
              href="/catalogos"
              className="px-10 py-5 rounded-full bg-[#00AEEF] text-white text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-3 group shadow-2xl shadow-[#00AEEF]/20 hover:scale-105 transition-all duration-500"
            >
              Ver Catálogo
              <ArrowUpRight
                size={16}
                className="group-hover:rotate-45 transition-transform duration-300"
              />
            </Link>

            <p className="text-sm font-light text-slate-500 max-w-[240px] leading-relaxed">
              Distribuidora autorizada de las mejores marcas. Ventas al por
              mayor y menor con delivery.
            </p>
          </div>
        </motion.div>

        {/* BLOQUE DE IMAGEN */}
        <motion.div
          className="lg:col-span-5 relative mt-6 lg:mt-0 z-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          {/* El borde ahora usa el color musgo (Verde Lima) para resaltar */}
          <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.1)] border-[8px] md:border-[12px] border-white bg-slate-50">
            <Image
              src="https://images.pexels.com/photos/4239117/pexels-photo-4239117.jpeg"
              alt="M&G S.A.C. Limpieza Profesional"
              fill
              priority
              className="object-cover transition-transform duration-[4s] hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a18]/60 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-[9px] uppercase tracking-[0.3em] opacity-90 mb-1 font-bold">
                M&G S.A.C.
              </p>
              <p className="text-2xl font-black tracking-tight uppercase">
                Servicios <span className="text-[#8CC63F]">Generales</span>
              </p>
            </div>
          </div>
          {/* El borde decorativo trasero usa el color arena del ppt */}
          <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border border-slate-100 rounded-[2.5rem]" />
        </motion.div>
      </div>
    </section>
  );
}
