"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartItem } from "@/lib/data";

interface CartContextType {
  cartItems: CartItem[];
  updateQty: (id: number, delta: number) => void;
  addItem: (item: CartItem) => void;
  subtotal: number;
  isCartOpen: boolean;
  setCartOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // ← Espera hidratación antes de leer localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mg-cart");
      if (saved) setCartItems(JSON.parse(saved));
    } catch {
      // localStorage no disponible
    }
    setHydrated(true);
  }, []);

  // ← Solo guarda cuando ya está hidratado
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("mg-cart", JSON.stringify(cartItems));
  }, [cartItems, hydrated]);

  const addItem = (item: CartItem) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        updateQty,
        addItem,
        subtotal,
        isCartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
