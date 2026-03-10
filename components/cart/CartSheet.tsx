"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowRight, Plus, Minus, X } from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useCart } from "@/components/providers/CartProvider";
import { SHIPPING_TARGET, SHIPPING_COST } from "@/lib/data";

export function CartSheet() {
  const { cartItems, updateQty, subtotal, isCartOpen, setCartOpen } = useCart();
  const progress = Math.min((subtotal / SHIPPING_TARGET) * 100, 100);
  const total =
    subtotal > SHIPPING_TARGET ? subtotal : subtotal + SHIPPING_COST;

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 transition-all active:scale-90 group outline-none">
          <ShoppingCart
            size={22}
            strokeWidth={1.2}
            className="text-stone-700 group-hover:text-negro transition-colors"
          />
          <AnimatePresence>
            {cartItems.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-0 right-0 w-4 h-4 rounded-full text-[9px] text-white flex items-center justify-center font-bold bg-musgo shadow-sm"
              >
                {cartItems.length}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        // Fix de scroll y foco
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="z-[100] w-[88%] sm:max-w-md border-l-0 p-0 flex flex-col h-full shadow-[-20px_0_50px_rgba(0,0,0,0.15)] rounded-l-[2.5rem] bg-crema transition duration-500 ease-in-out"
      >
        {/* Header Ultra-Compacto */}
        <SheetHeader className="px-8 pt-4 pb-4 border-b border-stone-200 bg-white/50 flex-none rounded-tl-[2.5rem] relative">
          {/* Botón X más ajustado */}
          <SheetClose className="absolute right-6 top-4 opacity-40 hover:opacity-100 transition-opacity outline-none">
            <X size={20} strokeWidth={1.5} />
          </SheetClose>

          <div className="flex flex-col items-start">
            {/* Título sin espacios (leading-none y -mt-1 para subirlo más) */}
            <SheetTitle className="font-serif italic text-4xl font-light text-negro leading-none -mt-1">
              Tu Selección
            </SheetTitle>
            <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-stone-400 mt-1">
              Curaduría de Limpieza
            </p>
          </div>

          {/* Barra envío gratis más pegada (mt-4 en lugar de mt-8) */}
          <div className="mt-4">
            <div className="flex justify-between text-[10px] mb-1 font-medium font-sans tracking-wide">
              <span className="text-stone-600">
                {progress < 100
                  ? `S/ ${(SHIPPING_TARGET - subtotal).toFixed(2)} para envío gratis`
                  : "¡Envío gratis!"}
              </span>
              <span className="text-musgo font-bold">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-[2px] w-full bg-stone-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="h-full rounded-full bg-musgo"
              />
            </div>
          </div>
        </SheetHeader>
        {/* Items - Contenedor Scrolleable */}
        <div className="flex-1 overflow-y-auto px-8 pr-6 custom-scrollbar scroll-smooth">
          <div className="py-8 space-y-10">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex gap-6 group relative"
                >
                  <div className="relative h-32 w-24 flex-none overflow-hidden rounded-2xl bg-stone-100 border border-stone-200 shadow-sm">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="96px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start text-stone-400 font-sans text-[9px] uppercase tracking-widest mb-1">
                        <span>{item.variant}</span>
                        <button
                          onClick={() => updateQty(item.id, -item.qty)}
                          className="hover:text-red-700 transition-colors uppercase font-bold"
                        >
                          Quitar
                        </button>
                      </div>
                      <h4 className="font-serif text-xl leading-tight text-negro pr-4">
                        {item.name}
                      </h4>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-stone-200 rounded-full px-3 py-1.5 gap-5 bg-white/50">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="text-stone-400 hover:text-negro transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-sans text-xs font-semibold w-4 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="text-stone-400 hover:text-negro transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-serif text-xl font-medium tracking-tight text-stone-800">
                        S/ {(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {cartItems.length === 0 && (
              <div className="py-5 text-center">
                <p className="font-serif italic text-3xl opacity-20 text-negro">
                  Tu cesta está vacía
                </p>
                <SheetClose asChild>
                  <button className="font-sans text-[10px] uppercase tracking-widest mt-4 underline underline-offset-8 opacity-50 hover:opacity-100 transition-opacity">
                    Explorar productos
                  </button>
                </SheetClose>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="p-8 bg-stone-50 border-t border-stone-200 flex-none flex-col space-y-5 rounded-bl-[2.5rem]">
          <div className="w-full space-y-3">
            <div className="flex justify-between font-sans text-[11px] uppercase tracking-widest text-stone-500">
              <span>Subtotal</span>
              <span className="text-negro font-bold">
                S/ {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-sans text-[11px] uppercase tracking-widest text-stone-500">
              <span>Envío Estimado</span>
              <span className="text-musgo font-bold uppercase">
                {subtotal > SHIPPING_TARGET
                  ? "Bonificado"
                  : `S/ ${SHIPPING_COST.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-4 flex justify-between items-center border-t border-stone-300">
              <span className="font-serif text-3xl font-light italic text-negro">
                Total
              </span>
              <span className="font-serif text-3xl font-semibold text-negro">
                S/ {total.toFixed(2)}
              </span>
            </div>
          </div>

          <button className="w-full py-5 rounded-2xl font-sans text-[11px] uppercase tracking-[0.3em] font-bold bg-negro text-crema transition-all hover:bg-stone-800 active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 group">
            Proceder al Pago{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
