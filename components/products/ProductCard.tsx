"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Check, Leaf, Zap } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/hooks/useCatalogFilters";

// Estilos de badge al estilo grandes marcas
const BADGE_CONFIG: Record<string, { bg: string; text: string; dot: string }> =
  {
    "Más vendido": {
      bg: "bg-orange-500",
      text: "text-white",
      dot: "bg-orange-300",
    },
    Nuevo: { bg: "bg-[#00AEEF]", text: "text-white", dot: "bg-blue-300" },
    Oferta: { bg: "bg-red-500", text: "text-white", dot: "bg-red-300" },
    Premium: { bg: "bg-slate-900", text: "text-white", dot: "bg-slate-500" },
    Agotado: { bg: "bg-slate-400", text: "text-white", dot: "bg-slate-300" },
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-[2rem] overflow-hidden border border-stone-100 hover:border-stone-200 hover:shadow-2xl hover:shadow-stone-200/60 transition-all duration-500 flex flex-col"
    >
      {/* Imagen */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-50">
        <Image
          src={product.img}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badge estilo Amazon/Tottus */}
        {badge && product.badge && (
          <div
            className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${badge.bg} shadow-lg`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-pulse`}
            />
            <span
              className={`font-sans text-[9px] uppercase tracking-[0.15em] font-black ${badge.text}`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Atributos — Bio / Concentrado */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {product.biodegradable && (
            <span className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
              <Leaf size={10} className="text-[#8CC63F]" />
              <span className="font-sans text-[8px] uppercase tracking-wider text-[#8CC63F] font-bold">
                Bio
              </span>
            </span>
          )}
          {product.concentrado && (
            <span className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
              <Zap size={10} className="text-[#00AEEF]" />
              <span className="font-sans text-[8px] uppercase tracking-wider text-[#00AEEF] font-bold">
                Conc.
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-2">
          {/* Línea y formato — con null safety */}
          {(product.linea || product.formato) && (
            <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-stone-400 mb-1">
              {[product.linea?.name, product.formato?.name]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          <h3 className="font-serif italic text-xl text-stone-900 leading-tight">
            {product.name}
          </h3>
        </div>
        <p className="font-sans text-xs text-stone-500 font-light leading-relaxed mt-2 flex-1 line-clamp-3">
          {product.desc}
        </p>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-100">
          <div>
            <span className="font-serif text-2xl font-semibold text-stone-900">
              S/ {Number(product.precio).toFixed(2)}
            </span>
            {product.badge === "Oferta" && (
              <p className="text-[9px] uppercase tracking-widest text-red-400 font-bold mt-0.5">
                Precio especial
              </p>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-sans text-[10px] uppercase tracking-widest font-bold transition-all duration-300 active:scale-95 ${
              added ? "bg-[#8CC63F]" : "bg-slate-900 hover:bg-[#00AEEF]"
            }`}
          >
            {added ? (
              <>
                <Check size={13} /> Añadido
              </>
            ) : (
              <>
                <ShoppingCart size={13} /> Añadir
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
