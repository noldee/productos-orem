"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { TOKENS } from "@/lib/data";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 px-6 overflow-hidden">
      {/* Decoración */}
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-salvia/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-terracota/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-10 items-center relative z-10">
        {/* Texto */}
        <motion.div
          className="lg:col-span-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="sans text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-8 block font-semibold">
            Diseño Botánico — Lima 2026
          </span>
          <h1 className="serif italic text-[10vw] lg:text-[7.5vw] leading-[0.82] mb-10 text-stone-900 tracking-tighter">
            Limpieza <br /> con{" "}
            <span className="serif text-musgo not-italic">espíritu</span> <br />{" "}
            botánico.
          </h1>
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <Link
              href="/catalogos"
              style={{ backgroundColor: TOKENS.terracota }}
              className="px-10 py-5 rounded-full text-white sans text-[11px] uppercase tracking-[0.2em] font-bold flex items-center gap-3 group shadow-2xl hover:brightness-110 transition-all"
            >
              Ver Catálogo
              <ArrowUpRight
                size={16}
                className="group-hover:rotate-45 transition-transform"
              />
            </Link>
            <p className="sans text-sm font-light text-stone-500 max-w-[240px] leading-relaxed">
              Redefiniendo el estándar de higiene a través de la naturaleza y la
              ciencia.
            </p>
          </div>
        </motion.div>

        {/* Imagen */}
        <motion.div
          className="lg:col-span-6 relative mt-10 lg:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.1)] border-[10px] border-white bg-stone-100">
            <Image
              src="https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=870&auto=format&fit=crop"
              alt="Atmósfera de Limpieza Refinada"
              fill
              priority
              className="object-cover transition-transform duration-[3s] hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-8 text-white">
              <p className="sans text-[9px] uppercase tracking-[0.2em] opacity-80 mb-1 font-medium">
                Colección 01
              </p>
              <p className="serif text-2xl italic tracking-tight">
                Pureza Esencial
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
