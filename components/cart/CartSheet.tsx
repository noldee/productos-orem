"use client";

import { motion, AnimatePresence } from "framer-motion";
import queryString from "query-string";
import {
  ShoppingCart,
  ArrowRight,
  Plus,
  Minus,
  X,
  ShoppingBag,
} from "lucide-react";
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
import { sendOrderToWhatsApp } from "@/utils/sendOrderToWhatsApp";

export function CartSheet() {
  const { cartItems, updateQty, subtotal, isCartOpen, setCartOpen } = useCart();
  const progress = Math.min((subtotal / SHIPPING_TARGET) * 100, 100);
  const total =
    subtotal > SHIPPING_TARGET ? subtotal : subtotal + SHIPPING_COST;

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 transition-all active:scale-95 group outline-none">
          <ShoppingCart
            size={24}
            strokeWidth={1.5}
            className="text-black group-hover:text-[#7D8C69]"
          />
          <AnimatePresence>
            {cartItems.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] text-white flex items-center justify-center font-bold bg-[#7D8C69] border-2 border-white shadow-sm"
              >
                {cartItems.length}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="z-[100] !w-[90vw] !max-w-[420px] border-none p-0 flex flex-col h-svh bg-white shadow-2xl rounded-l-2xl overflow-hidden"
        style={{ animation: "none" }}
      >
        {/* ── HEADER ── */}
        <SheetHeader className="px-6 pt-10 pb-5 flex-none bg-white border-b border-stone-100">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <SheetTitle className="font-serif italic text-[2.6rem] font-light text-black leading-tight">
                Tu Selección
              </SheetTitle>
              <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#7D8C69] font-bold">
                Curaduría de Bienestar
              </p>
            </div>
            <SheetClose className="mt-1 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-black transition-all outline-none">
              <X size={20} strokeWidth={2} />
            </SheetClose>
          </div>

          {/* Barra de progreso envío gratis */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-sans tracking-[0.08em] uppercase">
              <span className="text-stone-500 font-semibold">
                {progress < 100
                  ? `Faltan S/ ${(SHIPPING_TARGET - subtotal).toFixed(2)} para envío gratis`
                  : "✓ Envío gratis aplicado"}
              </span>
              <span className="text-[#7D8C69] font-black text-xs">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-[3px] w-full bg-stone-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: "circOut" }}
                className="h-full bg-[#7D8C69] rounded-full"
              />
            </div>
          </div>
        </SheetHeader>

        {/* ── CONTENEDOR DE LISTA DE PRODUCTOS ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 custom-scrollbar min-h-0">
          <AnimatePresence mode="popLayout" initial={false}>
            {cartItems.length > 0 ? (
              <motion.div
                key="cart-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 pr-2" /* pr-2 evita que el scroll choque con los productos */
              >
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-4 items-center bg-stone-50 rounded-2xl  border border-stone-100 shadow-sm"
                  >
                    {/* Imagen del Producto */}
                    <div className="relative w-24 h-24 flex-none rounded-xl overflow-hidden bg-white border border-stone-100 shadow-inner">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                        priority
                      />
                    </div>

                    {/* Información y Controles */}
                    <div className="flex-1 flex flex-col justify-between min-w-0 h-24">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          {item.variant && (
                            <p className="text-[9px] uppercase tracking-[0.2em] text-[#7D8C69] font-black truncate mb-0.5">
                              {item.variant}
                            </p>
                          )}
                          <h4 className="font-serif text-base text-black leading-tight font-medium line-clamp-2">
                            {item.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => updateQty(item.id, -item.qty)}
                          className="flex-none text-stone-300 hover:text-red-500 transition-colors p-1"
                          aria-label="Eliminar producto"
                        >
                          <X size={16} strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* Selector de Cantidad y Precio */}
                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex items-center border border-stone-200 rounded-full px-3 py-1 gap-4 bg-white shadow-sm">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="text-stone-400 hover:text-black transition-colors"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="text-sm font-black min-w-[14px] text-center text-black">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="text-stone-400 hover:text-black transition-colors"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>
                        <span className="font-sans text-base font-black text-black">
                          S/ {(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Estado Vacío (Centrado automáticamente por el contenedor padre) */
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center text-center space-y-5"
              >
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center">
                  <ShoppingBag
                    size={40}
                    strokeWidth={1}
                    className="text-stone-200"
                  />
                </div>
                <div>
                  <h3 className="font-serif italic text-2xl text-black">
                    Tu bolsa está vacía
                  </h3>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mt-2">
                    Agrega productos para comenzar
                  </p>
                </div>
                <SheetClose className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] hover:bg-[#7D8C69] transition-all shadow-lg">
                  VER PRODUCTOS
                </SheetClose>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── FOOTER FIJO ── */}
        <AnimatePresence>
          {cartItems.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SheetFooter className="px-6 pt-5 pb-8 bg-white border-t border-stone-100 flex-none flex-col gap-5">
                {/* Resumen */}
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-[11px] uppercase tracking-widest text-stone-500 font-bold">
                    <span>Subtotal</span>
                    <span className="text-black">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] uppercase tracking-widest text-stone-500 font-bold">
                    <span>Envío estimado</span>
                    <span
                      className={
                        subtotal > SHIPPING_TARGET
                          ? "text-[#7D8C69]"
                          : "text-black"
                      }
                    >
                      {subtotal > SHIPPING_TARGET
                        ? "GRATIS"
                        : `S/ ${SHIPPING_COST.toFixed(2)}`}
                    </span>
                  </div>
                </div>
                {/* Total */}
                <div className="flex justify-between items-end border-t border-stone-100 pt-4">
                  <span className="font-serif text-[2.2rem] italic text-black leading-none">
                    Total
                  </span>
                  <div className="text-right">
                    <p className="text-3xl font-black text-black tracking-tighter leading-none">
                      S/ {total.toFixed(2)}
                    </p>
                    <p className="text-[9px] text-stone-400 font-bold tracking-widest mt-1 uppercase">
                      Impuestos incluidos · PEN
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    sendOrderToWhatsApp({
                      cartItems,
                      subtotal,
                      total,
                      shippingCost: SHIPPING_COST,
                      shippingTarget: SHIPPING_TARGET,
                    })
                  }
                  className="w-full py-5 bg-black text-white text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-[#7D8C69] transition-all duration-300 flex items-center justify-center gap-3 group rounded-xl shadow-lg shadow-black/10"
                >
                  Finalizar Pedido
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </motion.span>
                </button>
              </SheetFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
