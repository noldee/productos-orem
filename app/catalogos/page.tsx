"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  Loader2,
} from "lucide-react";
import { useCatalogFilters } from "@/hooks/useCatalogFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { CartSheet } from "@/components/cart/CartSheet";

export default function CatalogosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const filters = useCatalogFilters();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#00AEEF] selection:text-white font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-slate-200 bg-white/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 hover:text-[#00AEEF] transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={3} />
            Regresar al inicio
          </Link>

          <div className="flex items-center gap-3">
            <CartSheet />
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-white bg-slate-900 px-5 py-2.5 rounded-xl hover:bg-[#00AEEF] transition-all relative"
            >
              <SlidersHorizontal size={14} />
              Filtros
              {filters.totalFiltros > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[9px] text-white flex items-center justify-center font-black bg-[#00AEEF] border-2 border-white">
                  {filters.totalFiltros}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="px-6 pt-16 pb-12 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00AEEF]/5 blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-[#00AEEF]" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#00AEEF] font-black">
              Suministros M&G S.A.C.
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.85] mb-6 tracking-tighter uppercase">
            NUESTRO <br />
            <span className="text-transparent border-text-industrial">
              CATÁLOGO
            </span>
          </h1>

          <p className="text-slate-500 font-medium text-xs max-w-md leading-relaxed uppercase tracking-wider">
            Distribuidora de productos de limpieza al por mayor y menor.
            Trabajamos con las mejores marcas del mercado.
          </p>
        </motion.div>

        {/* Categorías dinámicas */}
        <div className="flex gap-2 mt-12 flex-wrap">
          {filters.loadingData ? (
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 size={14} className="animate-spin" />
              <span className="text-[10px] uppercase tracking-widest font-black">
                Cargando...
              </span>
            </div>
          ) : (
            filters.categoriasDisponibles.map((cat) => (
              <button
                key={cat}
                onClick={() => filters.setCategoriaActiva(cat)}
                className={`px-6 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-300 border-2 ${
                  filters.categoriaActiva === cat
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                    : "bg-white text-slate-400 border-slate-100 hover:border-[#00AEEF] hover:text-[#00AEEF]"
                }`}
              >
                {cat}
              </button>
            ))
          )}
        </div>
      </section>

      {/* LAYOUT PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 pb-32 flex flex-col md:flex-row gap-12">
        {/* SIDEBAR ESCRITORIO */}
        <aside className="hidden md:block w-72 shrink-0">
          <div className="sticky top-28 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] uppercase tracking-[0.3em] text-slate-900 font-black">
                  Refinar Búsqueda
                </h3>
                {filters.totalFiltros > 0 && (
                  <button
                    onClick={filters.onReset}
                    className="group p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <X
                      size={16}
                      className="text-slate-300 group-hover:text-red-500"
                    />
                  </button>
                )}
              </div>

              {filters.loadingData ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={20} className="animate-spin text-slate-300" />
                </div>
              ) : (
                <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  <FilterSidebar {...filters} />
                </div>
              )}
            </div>

            {/* Banner WhatsApp */}
            <div className="bg-[#00AEEF] rounded-[2rem] p-8 text-white">
              <p className="text-[9px] uppercase tracking-widest font-black mb-2 opacity-80">
                Asesoría Directa
              </p>
              <h4 className="text-lg font-black leading-tight mb-1 uppercase tracking-tighter">
                ¿Necesitas una cotización?
              </h4>
              <p className="text-[10px] opacity-70 mb-4 font-medium">
                Atendemos al por mayor y menor con delivery a tu negocio.
              </p>
              <a
                href="https://wa.me/51944339257"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] uppercase tracking-widest font-black hover:bg-slate-100 transition-all text-center"
              >
                WhatsApp 944 339 257
              </a>
            </div>
          </div>
        </aside>

        {/* GRILLA */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-6">
            <p className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">
              <span className="text-[#00AEEF]">{filters.filtered.length}</span>{" "}
              productos encontrados
            </p>
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
              <button className="p-2 bg-slate-50 rounded-lg text-slate-900">
                <LayoutGrid size={16} />
              </button>
              <button className="p-2 text-slate-300 hover:text-slate-500">
                <List size={16} />
              </button>
            </div>
          </div>

          {filters.loadingData ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={32} className="animate-spin text-slate-300" />
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                  Cargando productos...
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filters.filtered.length > 0 ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filters.filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X size={32} className="text-slate-200" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
                    Sin coincidencias
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-8">
                    Intenta ajustar los parámetros de búsqueda.
                  </p>
                  <button
                    onClick={filters.onReset}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] uppercase tracking-[0.2em] font-black hover:bg-[#00AEEF] transition-all"
                  >
                    Restablecer filtros
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
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
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xs z-50 overflow-hidden bg-white flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-900">
                  Filtros
                </h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-900" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <FilterSidebar {...filters} />
              </div>
              <div className="p-6 border-t border-slate-100">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full py-4 bg-[#00AEEF] text-white rounded-xl text-[11px] uppercase tracking-widest font-black shadow-lg shadow-[#00AEEF]/20"
                >
                  Ver {filters.filtered.length} productos
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .border-text-industrial {
          -webkit-text-stroke: 1px #cbd5e1;
          color: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
