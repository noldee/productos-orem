"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Check, Leaf, Zap, Info } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/hooks/useCatalogFilters";

const BADGE_CONFIG: Record<string, { bg: string; text: string; dot: string }> =
  {
    "Más vendido": {
      bg: "bg-orange-500",
      text: "text-white",
      dot: "bg-orange-200",
    },
    Nuevo: { bg: "bg-sky-500", text: "text-white", dot: "bg-sky-200" },
    Oferta: { bg: "bg-red-500", text: "text-white", dot: "bg-red-200" },
    Premium: { bg: "bg-zinc-900", text: "text-white", dot: "bg-zinc-500" },
    Agotado: {
      bg: "bg-stone-200",
      text: "text-stone-500",
      dot: "bg-stone-400",
    },
  };

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { addItem, setCartOpen } = useCart();

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      variant: [product.linea?.name, product.formato?.name]
        .filter(Boolean)
        .join(" — "),
      price: product.precio,
      qty: 1,
      img: product.img,
    });
    setCartOpen(true);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const badge = product.badge ? BADGE_CONFIG[product.badge] : null;
  const isOferta = product.badge === "Oferta";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 hover:border-white hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] transition-all duration-500 flex flex-col h-full"
    >
      {/* ── Contenedor de Imagen ── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-50">
        <Image
          src={product.img}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Badge Flotante Superior */}
        {badge && (
          <div
            className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full ${badge.bg} shadow-lg backdrop-blur-md`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-pulse`}
            />
            <span
              className={`text-[10px] uppercase tracking-widest font-black ${badge.text}`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Atributos Inferiores (Glassmorphism) */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {product.biodegradable && (
            <div className="bg-white/80 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/50">
              <Leaf size={14} className="text-green-600" />
            </div>
          )}
          {product.concentrado && (
            <div className="bg-white/80 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/50">
              <Zap size={14} className="text-sky-500" />
            </div>
          )}
        </div>
      </div>

      {/* ── Cuerpo de Información ── */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        {/* Categoría y Título */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-1">
            {product.linea?.name || "Línea Especial"}
          </p>
          <h3 className="font-serif italic text-xl text-stone-900 leading-tight">
            {product.name}
          </h3>
        </div>

        <p className="text-[13px] text-stone-500 font-light leading-relaxed line-clamp-2">
          {product.desc}
        </p>

        {/* ── Bloque de Precios (Diseño Profesional de Ventas) ── */}
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between bg-stone-50 rounded-2xl p-3 border border-stone-100">
            {/* Precio Unitario */}
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-tighter text-stone-400 font-bold">
                Unidad
              </span>
              <span
                className={`text-xl font-bold tracking-tight ${isOferta ? "text-red-500" : "text-stone-900"}`}
              >
                S/ {Number(product.precio).toFixed(2)}
              </span>
            </div>

            {/* Separador Vertical */}
            <div className="w-px h-8 bg-stone-200" />

            {/* Precio Mayor */}
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-tighter text-stone-400 font-bold">
                Por Mayor
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-sky-600">
                  S/ {Number(product.precioMayor).toFixed(2)}
                </span>
                <Info size={10} className="text-stone-300" />
              </div>
            </div>
          </div>

          {/* Botón de Acción Principal */}
          <button
            onClick={handleAdd}
            disabled={product.badge === "Agotado"}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-[11px] uppercase tracking-[0.2em] font-black transition-all duration-300 active:scale-95 ${
              added
                ? "bg-green-600 shadow-lg shadow-green-100"
                : "bg-stone-900 hover:bg-sky-600 shadow-lg shadow-stone-200"
            } ${product.badge === "Agotado" ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
          >
            {added ? (
              <>
                <Check size={16} strokeWidth={3} /> Añadido
              </>
            ) : (
              <>
                <ShoppingCart size={16} /> Agregar al Carrito
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
