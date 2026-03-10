"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CartSheet } from "@/components/cart/CartSheet";
import Link from "next/link";
import { User2Icon, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

// Enlaces institucionales y de servicio
const NAV_LINKS = [
  { name: "La Marca", href: "#about" },
  { name: "Suministros", href: "#servicios" },
  { name: "Contacto", href: "#contacto" },
];
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none pr-[var(--removed-body-scroll-bar-size)]"
    >
      <nav
        className={`
          pointer-events-auto flex items-center justify-between px-6 md:px-8
          transition-all duration-700 w-full backdrop-blur-md border-b
          ${
            isScrolled
              ? "py-3 bg-crema/80 border-arena shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              : "py-5 bg-transparent border-transparent"
          }
        `}
      >
        {/* Logo */}
        <div className="font-serif italic text-xl md:text-2xl font-semibold tracking-tight cursor-pointer leading-tight">
          <Link href="/">
            <span className="text-negro">Productos</span>
            <span className="text-terracota">.ORE M</span>
          </Link>
        </div>

        {/* Links — solo desktop */}
        <div className="hidden md:flex gap-10 items-center">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="font-sans text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-500 hover:text-negro transition-all hover:translate-y-[-1px]"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <CartSheet />

          {!loading && (
            <>
              {isAdmin ? (
                <>
                  {/* Desktop */}
                  <Link
                    href="/dashboard"
                    className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full sans text-[10px] uppercase tracking-widest font-bold bg-musgo text-crema hover:opacity-90 transition-all active:scale-95"
                  >
                    <LayoutDashboard size={13} />
                    Administrar
                  </Link>
                  {/* Mobile */}
                  <Link
                    href="/dashboard"
                    className="flex sm:hidden items-center gap-1.5 px-4 py-2 rounded-full sans text-[9px] uppercase tracking-widest font-bold bg-musgo text-crema active:scale-95 transition-all"
                  >
                    <LayoutDashboard size={12} />
                    Admin
                  </Link>
                </>
              ) : (
                <>
                  {/* Desktop */}
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full sans text-[10px] uppercase tracking-widest font-bold bg-negro text-crema hover:opacity-90 transition-all active:scale-95"
                  >
                    <User2Icon size={13} />
                    Ingresar
                  </Link>
                  {/* Mobile */}
                  <Link
                    href="/login"
                    className="flex sm:hidden items-center gap-1.5 px-4 py-2 rounded-full sans text-[9px] uppercase tracking-widest font-bold bg-negro text-crema active:scale-95 transition-all"
                  >
                    <User2Icon size={12} />
                    Ingresar
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
