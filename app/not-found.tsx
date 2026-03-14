"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 relative overflow-hidden">

      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-stone-100 blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full bg-stone-50 blur-[100px]" />
      </div>

      {/* Número 404 decorativo de fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="text-[30vw] font-serif font-bold text-stone-50 leading-none tracking-tighter"
          style={{ letterSpacing: "-0.05em" }}
        >
          404
        </span>
      </div>

      {/* Contenido principal */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 text-center max-w-md"
      >
        {/* Ícono */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 text-stone-400 mb-8 mx-auto"
        >
          <ShoppingBag size={28} strokeWidth={1.5} />
        </motion.div>

        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="font-lato text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold mb-4">
            Página no encontrada
          </p>
          <h1 className="font-lato font-bold text-5xl md:text-6xl text-stone-900 leading-tight mb-4">
            Este página <br /> no existe.
          </h1>
          <p className="font-lato text-sm text-stone-400 leading-relaxed mb-10">
            La página que buscas no está disponible o fue retirada del catálogo.
            Regresa a la tienda y descubre nuestros insumos premium.
          </p>
        </motion.div>

        {/* Botones */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-negro text-crema rounded-full font-sans text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-stone-800 transition-all active:scale-[0.98]"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
            Volver a la tienda
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-stone-200 font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-stone-500 hover:text-stone-900 hover:border-stone-400 transition-all active:scale-[0.98]"
          >
            Iniciar sesión
          </Link>
        </motion.div>
      </motion.div>

      {/* Marca de agua inferior */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-serif italic text-stone-200 text-lg select-none">
        Pureza.ORE M
      </div>
    </div>
  );
}