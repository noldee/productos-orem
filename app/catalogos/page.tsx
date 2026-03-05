"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import { TOKENS } from "@/lib/data";
import { CATEGORIAS } from "@/lib/products";
import { useCatalogFilters } from "@/hooks/useCatalogFilters";
import { ProductCard } from "@/components/ui/ProductCard";
import { FilterSidebar } from "@/components/ui/FilterSidebar";
import { CartSheet } from "@/components/ui/CartSheet";

export default function CatalogosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const filters = useCatalogFilters();

  return (
    <div
      className="min-h-screen selection:bg-[#A3B899] selection:text-white"
      style={{ backgroundColor: TOKENS.crema, color: TOKENS.negro }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@200;300;400;500;600&display=swap');
        .serif { font-family: 'Cormorant Garamond', serif; }
        .sans  { font-family: 'Inter', sans-serif; }
        .text-musgo { color: #3E5245; }
        .bg-musgo { background-color: #3E5245; }
        .border-musgo { border-color: #3E5245; }
        .text-salvia { color: #A3B899; }
        .bg-salvia { background-color: #A3B899; }
        .bg-terracota { background-color: #C66B44; }
      `}</style>

      {/* HEADER */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b border-stone-100"
        style={{ backgroundColor: "rgba(249,247,242,0.85)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 sans text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft size={14} />
            Inicio
          </Link>
          <div className="flex items-center gap-4">
            <CartSheet />
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex items-center gap-2 sans text-[10px] uppercase tracking-widest text-stone-600 border border-stone-200 px-4 py-2 rounded-full hover:border-stone-400 transition-all relative"
            >
              <SlidersHorizontal size={13} />
              Filtros
              {filters.totalFiltros > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[8px] text-white flex items-center justify-center font-bold"
                  style={{ backgroundColor: TOKENS.musgo }}
                >
                  {filters.totalFiltros}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="sans text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-4 block">
            Colección 2026
          </span>
          <h1 className="serif italic text-5xl md:text-7xl text-stone-900 leading-[0.9] mb-4">
            Catálogo <br />
            <span className="text-musgo not-italic">Completo</span>
          </h1>
          <p className="sans text-stone-500 font-light text-sm max-w-md leading-relaxed">
            Productos de limpieza premium formulados con ingredientes naturales
            peruanos.
          </p>
        </motion.div>

        <div className="flex gap-3 mt-8 flex-wrap">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => filters.setCategoriaActiva(cat)}
              className={`px-5 py-2 rounded-full sans text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 border ${
                filters.categoriaActiva === cat
                  ? "text-white border-transparent"
                  : "text-stone-500 border-stone-200 hover:border-stone-400"
              }`}
              style={
                filters.categoriaActiva === cat
                  ? { backgroundColor: TOKENS.negro, borderColor: TOKENS.negro }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* LAYOUT PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 pb-32 flex gap-10">
        {/* Sidebar desktop */}
        <aside className="hidden md:block w-56 shrink-0">
          <div
            className="sticky top-24 bg-white rounded-[2rem] border border-stone-100 overflow-hidden flex flex-col"
            style={{ maxHeight: "calc(100vh - 7rem)" }}
          >
            <div className="p-6 border-b border-stone-100 flex items-center justify-between shrink-0">
              <h3 className="sans text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold">
                Filtros
              </h3>
              {filters.totalFiltros > 0 && (
                <button
                  onClick={filters.onReset}
                  className="text-stone-400 hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="overflow-y-auto p-6">
              <FilterSidebar {...filters} />
            </div>
          </div>
        </aside>

        {/* Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <p className="sans text-xs text-stone-400">
              <span className="text-stone-900 font-semibold">
                {filters.filtered.length}
              </span>{" "}
              productos
              {filters.totalFiltros > 0 && (
                <button
                  onClick={filters.onReset}
                  className="ml-3 text-stone-400 hover:text-red-400 underline underline-offset-4 transition-colors"
                >
                  limpiar filtros
                </button>
              )}
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            {filters.filtered.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filters.filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center"
              >
                <p className="serif italic text-4xl text-stone-300 mb-4">
                  Sin resultados
                </p>
                <p className="sans text-sm text-stone-400 mb-6">
                  Ningún producto coincide con los filtros.
                </p>
                <button
                  onClick={filters.onReset}
                  className="sans text-[10px] uppercase tracking-widest underline underline-offset-8 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  Limpiar filtros
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm z-50 overflow-y-auto p-8 md:hidden"
              style={{ backgroundColor: TOKENS.crema }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="sans text-[10px] uppercase tracking-[0.3em] font-bold">
                  Filtros
                </h3>
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={18} className="text-stone-500" />
                </button>
              </div>
              <FilterSidebar {...filters} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
