"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CartSheet } from "@/components/cart/CartSheet";
import Link from "next/link";
import { User2Icon, LayoutDashboard, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import gsap from "gsap";
import Image from "next/image";

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

    // BLOQUEO DE SCROLL TOTAL
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("scroll", update);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        duration: 0.8,
        clipPath: "circle(150% at 100% 0%)",
        ease: "expo.inOut",
      });

      const validLinks = linksRef.current.filter((el) => el !== null);
      gsap.fromTo(
        validLinks,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.3,
        },
      );
    } else {
      gsap.to(menuRef.current, {
        duration: 0.6,
        clipPath: "circle(0% at 100% 0%)",
        ease: "expo.inOut",
      });
    }
  }, [isOpen]);

  // Sin sombras, solo bordes limpios
  const navBgClass = isScrolled
    ? "bg-white/95 border-slate-200 py-3"
    : "bg-transparent border-transparent py-5";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none font-lato"
      >
        <nav
          className={`pointer-events-auto flex items-center justify-between px-6 md:px-12 transition-all duration-500 w-full backdrop-blur-md border-b ${navBgClass}`}
        >
          {/* Logo */}
          <div className="z-50">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 group"
            >
              <Image
                src="/logo.png"
                alt="logo"
                width={42}
                height={42}
                className="object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col leading-none">
                <span
                  className={`text-xl font-black tracking-tighter transition-colors duration-500 ${isOpen ? "text-white" : "text-slate-900"}`}
                >
                  M&G <span className="text-[#00AEEF]">S.A.C.</span>
                </span>
                <span
                  className={`text-[9px] uppercase tracking-[0.3em] font-bold transition-colors duration-500 ${isOpen ? "text-slate-400" : "text-slate-500"}`}
                >
                  Servicios Generales
                </span>
              </div>
            </Link>
          </div>

          {/* NAVEGACIÓN DESKTOP RESTAURADA */}
          <div className="hidden lg:flex gap-10 items-center">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-[#00AEEF] transition-all"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-6 z-50">
            {!isOpen && <CartSheet />}

            {/* Hamburguesa Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col items-end justify-center gap-1.5 w-10 h-10 focus:outline-none group lg:hidden"
            >
              <div
                className={`h-[2px] bg-current transition-all duration-500 ${isOpen ? "w-8 rotate-45 translate-y-[4px] text-white" : "w-8 text-slate-900"}`}
              />
              <div
                className={`h-[2px] bg-current transition-all duration-500 ${isOpen ? "w-8 -rotate-45 -translate-y-[4px] text-white" : "w-5 group-hover:w-8 text-slate-900"}`}
              />
            </button>

            {/* Acciones Desktop (Login/User) */}
            <div className="hidden lg:block">
              {!loading &&
                !isOpen &&
                (user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">
                      <div className="w-6 h-6 rounded-full bg-[#8CC63F] text-white flex items-center justify-center font-bold text-[10px]">
                        {user.email?.[0].toUpperCase()}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">
                        Cuenta
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 p-2 border-slate-200"
                    >
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 font-bold text-[#00AEEF] py-2 cursor-pointer"
                          >
                            <LayoutDashboard size={14} /> Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={logout}
                        className="flex items-center gap-2 font-bold text-red-500 py-2 cursor-pointer"
                      >
                        <LogOut size={14} /> Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-black text-white bg-slate-900 hover:bg-[#00AEEF] transition-all"
                  >
                    <User2Icon size={14} /> Ingresar
                  </Link>
                ))}
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Fullscreen Mobile Menu */}
      <div
        ref={menuRef}
        style={{ clipPath: "circle(0% at 100% 0%)" }}
        className="fixed inset-0 bg-[#0f172a] z-[45] flex flex-col justify-between pt-32 pb-10 px-8 lg:hidden"
      >
        <div className="flex flex-col gap-8">
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#8CC63F] font-black opacity-80">
            Menú
          </span>
          <div className="flex flex-col gap-6">
            {NAV_LINKS.map((item, i) => (
              <Link
                key={item.name}
                href={item.href}
                ref={(el) => {
                  linksRef.current[i] = el;
                }}
                onClick={() => setIsOpen(false)}
                className="text-5xl font-black text-white uppercase tracking-tighter hover:text-[#00AEEF] flex items-center justify-between group transition-colors"
              >
                {item.name}
                <ArrowRight
                  className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#00AEEF]"
                  size={35}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Acceso Clientes Mobile Estilo Link Premium */}
        {/* Acceso Clientes Mobile Estilo Link Premium */}
        <div
          ref={(el) => {
            linksRef.current[NAV_LINKS.length] = el;
          }}
          className="w-full"
        >
          {!loading &&
            (user ? (
              <div className="bg-white/5 rounded-[32px] p-6 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#8CC63F] text-white flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(140,198,63,0.3)]">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                      Sesión activa
                    </span>
                    <span className="text-white font-bold text-sm truncate">
                      {user.email}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {/* BOTÓN DASHBOARD (Solo si es Admin) */}
                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#00AEEF] text-white font-black text-[11px] uppercase tracking-widest hover:bg-[#009bd4] transition-all shadow-lg shadow-[#00AEEF]/20"
                    >
                      <LayoutDashboard size={18} /> Ir al Dashboard
                    </Link>
                  )}

                  {/* BOTÓN CERRAR SESIÓN */}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-red-500/10 text-red-400 font-black text-[11px] uppercase tracking-widest border border-red-500/20 hover:bg-red-500/20 transition-all"
                  >
                    <LogOut size={18} /> Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between bg-[#00AEEF] hover:bg-[#009bd4] p-2 rounded-full transition-all border border-[#00AEEF]"
              >
                <span className="ml-6 text-white font-black uppercase tracking-widest text-[11px]">
                  Acceso Área Clientes
                </span>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#00AEEF]">
                  <User2Icon size={18} />
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}
