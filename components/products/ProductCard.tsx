"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { BADGE_STYLES, type Product } from "@/lib/products";

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
      variant: `${product.linea} — ${product.formato}`,
      price: product.precio,
      qty: 1,
      img: product.img,
    });
    setCartOpen(true);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-[2rem] overflow-hidden border border-stone-100 hover:border-stone-200 hover:shadow-2xl hover:shadow-stone-200/60 transition-all duration-500 flex flex-col"
    >
      {/* Contenedor de Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-50">
        <Image
          src={product.img}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badge superior (ej: "Nuevo", "Best Seller") */}
        {product.badge && (
          <span
            className={`absolute top-4 left-4 px-3 py-1 rounded-full font-sans text-[9px] uppercase tracking-widest font-bold ${BADGE_STYLES[product.badge]}`}
          >
            {product.badge}
          </span>
        )}

        {/* Badges de características (Bio, Concentrado) */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {product.biodegradable && (
            <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full font-sans text-[8px] uppercase tracking-wider text-musgo font-bold border border-musgo/20">
              Bio
            </span>
          )}
          {product.concentrado && (
            <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full font-sans text-[8px] uppercase tracking-wider text-stone-600 font-bold border border-stone-200">
              Concentrado
            </span>
          )}
        </div>
      </div>

      {/* Info del Producto */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-2">
          <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-stone-400 mb-1">
            {product.linea} · {product.formato}
          </p>
          <h3 className="font-serif italic text-xl text-stone-900 leading-tight">
            {product.name}
          </h3>
        </div>
        <p className="font-sans text-xs text-stone-500 font-light leading-relaxed mt-2 flex-1">
          {product.desc}
        </p>

        {/* Precio + Botón de Acción */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-100">
          <span className="font-serif text-2xl font-semibold text-stone-900">
            S/ {product.precio.toFixed(2)}
          </span>

          <button
            onClick={handleAdd}
            /* CAMBIO CLAVE: 
               Usamos clases condicionales de Tailwind en lugar de style={{ backgroundColor }}.
               bg-musgo y bg-negro ahora son clases nativas de tu @theme.
            */
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-sans text-[10px] uppercase tracking-widest font-bold transition-all duration-300 active:scale-95 ${
              added ? "bg-musgo" : "bg-negro hover:opacity-90"
            }`}
          >
            {added ? (
              <>
                <Check size={13} />
                Añadido
              </>
            ) : (
              <>
                <ShoppingCart size={13} />
                Añadir
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
