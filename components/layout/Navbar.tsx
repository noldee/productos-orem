"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CartSheet } from "@/components/cart/CartSheet";
import Link from "next/link";
import { User2Icon, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import gsap from "gsap";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { name: "La Marca", href: "#about" },
  { name: "Suministros", href: "#servicios" },
  { name: "Contacto", href: "#contacto" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { user, isAdmin, loading, logout } = useAuth();

  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const update = () => {
      if (!isOpen) setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", update);

    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      if (scrollY) window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      window.removeEventListener("scroll", update);
      document.body.style.position = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        duration: 0.8,
        clipPath: "circle(150% at 100% 0%)",
        ease: "power4.inOut",
      });

      const validLinks = linksRef.current.filter((el) => el !== null);

      gsap.fromTo(
        validLinks,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.4,
        },
      );
    } else {
      gsap.to(menuRef.current, {
        duration: 0.6,
        clipPath: "circle(0% at 100% 0%)",
        ease: "power4.inOut",
      });
    }
  }, [isOpen]);

  const navBgClass = isOpen
    ? "bg-transparent border-transparent pt-6 pb-4"
    : isScrolled
      ? "bg-crema/90 pt-3 pb-3 border-stone-200 shadow-sm"
      : "bg-transparent pt-4 pb-4 border-transparent";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        <nav
          className={`pointer-events-auto flex items-center justify-between px-6 md:px-12 transition-all duration-700 w-full backdrop-blur-md border-b ${navBgClass}`}
        >
          {/* Logo */}
          <div className="z-50 font-serif italic text-xl md:text-2xl font-semibold tracking-tight">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <span className={isOpen ? "text-crema" : "text-negro"}>
                Productos
              </span>
              <span className="text-terracota">.ORE M</span>
            </Link>
          </div>

          {/* Links Desktop */}
          <div className="hidden lg:flex gap-10 items-center">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-sans text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-500 hover:text-negro transition-all"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6 z-50">
            {!isOpen && <CartSheet />}

            {/* Hamburguesa */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="group flex flex-col items-end justify-center gap-1.5 w-8 h-8 focus:outline-none"
              aria-label="Menu"
            >
              <div
                className={`h-[1.5px] bg-current transition-all duration-500 ${
                  isOpen
                    ? "w-7 rotate-45 translate-y-[4px] text-crema"
                    : "w-7 text-negro lg:hidden"
                }`}
              />
              <div
                className={`h-[1.5px] bg-current transition-all duration-500 ${
                  isOpen
                    ? "w-7 -rotate-45 -translate-y-[4px] text-crema"
                    : "w-4 text-negro group-hover:w-7 lg:hidden"
                }`}
              />
            </button>

            {/* Botón derecho Desktop */}
            <div className="hidden lg:block">
              {!loading && !isOpen && (
                <>
                  {/* ADMIN */}
                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-crema bg-musgo transition-all active:scale-95"
                    >
                      <LayoutDashboard size={13} />
                      <span>Admin</span>
                    </Link>
                  )}

                  {/* USER */}
                  {user && !isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 hover:opacity-80 transition">
                          <div className="w-8 h-8 rounded-full bg-negro text-crema flex items-center justify-center font-bold text-sm uppercase">
                            {user.email?.[0]}
                          </div>

                          <span className="text-xs font-semibold text-negro">
                            {user.email?.split("@")[0]}
                          </span>
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          className="cursor-pointer text-red-500"
                          onClick={logout}
                        >
                          Cerrar sesión
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {/* SIN LOGIN */}
                  {!user && (
                    <Link
                      href="/login"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-crema bg-negro transition-all active:scale-95"
                    >
                      <User2Icon size={13} />
                      <span>Ingresar</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Menú móvil */}
      <div
        ref={menuRef}
        style={{ clipPath: "circle(0% at 100% 0%)" }}
        className="fixed inset-0 bg-negro z-[45] flex flex-col justify-center px-10 lg:hidden"
      >
        <div className="flex flex-col gap-10">
          <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-stone-500 mb-2">
            Menú
          </span>

          {NAV_LINKS.map((item, i) => (
            <Link
              key={item.name}
              href={item.href}
              ref={(el) => {
                linksRef.current[i] = el;
              }}
              onClick={() => setIsOpen(false)}
              className="font-serif italic text-5xl text-crema hover:text-terracota transition-colors"
            >
              {item.name}
            </Link>
          ))}

          <div
            ref={(el) => {
              linksRef.current[NAV_LINKS.length] = el;
            }}
            className="pt-12 mt-4 border-t border-stone-800"
          >
            {!loading && (
              <>
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-crema hover:text-terracota font-sans text-xs uppercase tracking-[0.3em]"
                  >
                    Dashboard de Control
                    <LayoutDashboard size={18} className="text-terracota" />
                  </Link>
                )}

                {user && !isAdmin && (
                  <div className="flex items-center gap-4 text-crema font-sans text-xs uppercase tracking-[0.3em]">
                    <div className="w-8 h-8 rounded-full bg-stone-700 text-crema flex items-center justify-center font-bold text-sm uppercase">
                      {user.email?.[0]}
                    </div>
                    <span>{user.email}</span>
                  </div>
                )}

                {!user && (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-crema hover:text-terracota font-sans text-xs uppercase tracking-[0.3em]"
                  >
                    Acceso Clientes
                    <User2Icon size={18} className="text-terracota" />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
