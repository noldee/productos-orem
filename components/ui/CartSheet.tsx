"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowRight, Plus, Minus } from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "@/components/providers/CartProvider";
import { TOKENS, SHIPPING_TARGET, SHIPPING_COST } from "@/lib/data";

export function CartSheet() {
  const { cartItems, updateQty, subtotal, isCartOpen, setCartOpen } = useCart();
  const progress = Math.min((subtotal / SHIPPING_TARGET) * 100, 100);
  const total =
    subtotal > SHIPPING_TARGET ? subtotal : subtotal + SHIPPING_COST;

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 transition-all active:scale-90">
          <ShoppingCart size={22} strokeWidth={1.2} />
          <AnimatePresence>
            {cartItems.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                style={{ backgroundColor: TOKENS.musgo }}
                className="absolute top-0 right-0 w-4 h-4 rounded-full text-[9px] text-white flex items-center justify-center font-bold"
              >
                {cartItems.length}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="z-[100] w-[88%] sm:max-w-md border-l-0 p-0 flex flex-col h-full shadow-[-20px_0_50px_rgba(0,0,0,0.15)] rounded-l-[2.5rem]"
        style={{ backgroundColor: TOKENS.crema }}
      >
        {/* Header */}
        <SheetHeader className="p-8 border-b border-stone-200 bg-white/50 flex-none rounded-tl-[2.5rem]">
          <div className="flex justify-between items-center">
            <div>
              <SheetTitle className="serif italic text-4xl font-light">
                Tu Selección
              </SheetTitle>
              <p className="sans text-[10px] uppercase tracking-widest text-stone-400 mt-1">
                Curaduría de Limpieza
              </p>
            </div>
          </div>

          {/* Barra envío gratis */}
          <div className="mt-8">
            <div className="flex justify-between text-[11px] mb-2 font-medium sans tracking-wide">
              <span>
                {progress < 100
                  ? `Te faltan S/ ${(SHIPPING_TARGET - subtotal).toFixed(2)} para envío gratis`
                  : "¡Tienes envío gratis!"}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-[3px] w-full bg-stone-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: TOKENS.musgo }}
              />
            </div>
          </div>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8">
          <div className="py-8 space-y-10">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
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
                      <div className="flex justify-between items-start text-stone-400 sans text-[9px] uppercase tracking-widest mb-1">
                        <span>{item.variant}</span>
                        <button
                          onClick={() => updateQty(item.id, -item.qty)}
                          className="hover:text-red-800 transition-colors uppercase"
                        >
                          Quitar
                        </button>
                      </div>
                      <h4 className="serif text-xl leading-tight text-stone-900 pr-4">
                        {item.name}
                      </h4>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-stone-300 rounded-full px-3 py-1.5 gap-5 bg-white/50">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="text-stone-400 hover:text-black transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="sans text-xs font-semibold w-4 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="text-stone-400 hover:text-black transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="serif text-xl font-medium tracking-tight text-stone-800">
                        S/ {(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {cartItems.length === 0 && (
              <div className="py-32 text-center">
                <p className="serif italic text-3xl opacity-20 text-stone-900">
                  Tu cesta está vacía
                </p>
                <button className="sans text-[10px] uppercase tracking-widest mt-4 underline underline-offset-8 opacity-50">
                  Explorar productos
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="p-8 bg-stone-50 border-t border-stone-200 flex-none flex-col space-y-5 rounded-bl-[2.5rem]">
          <div className="w-full space-y-3">
            <div className="flex justify-between sans text-[11px] uppercase tracking-widest text-stone-500">
              <span>Subtotal</span>
              <span className="text-stone-900">S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between sans text-[11px] uppercase tracking-widest text-stone-500">
              <span>Envío Estimado</span>
              <span style={{ color: TOKENS.musgo }}>
                {subtotal > SHIPPING_TARGET
                  ? "Bonificado"
                  : `S/ ${SHIPPING_COST.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-4 flex justify-between items-center border-t border-stone-300">
              <span className="serif text-3xl font-light italic">Total</span>
              <span className="serif text-3xl font-semibold">
                S/ {total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            style={{ backgroundColor: TOKENS.negro, color: TOKENS.crema }}
            className="w-full py-5 rounded-2xl sans text-[11px] uppercase tracking-[0.3em] font-bold transition-all hover:opacity-90 active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 group"
          >
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
