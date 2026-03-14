"use client";

import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";

const EXPLORE = [
  { name: "Inicio", href: "#" },
  { name: "Quiénes Somos", href: "#about" },
  { name: "Nuestros Servicios", href: "#servicios" },
  { name: "Marcas", href: "#marcas" },
];

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] pt-20 pb-10 px-6 rounded-t-[3rem] font-lato text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          {/* COLUMNA 1: IDENTIDAD (Extraída del PPT) */}
          <div className="md:col-span-5">
            <div className="text-3xl font-black mb-6 tracking-tighter uppercase">
              M&G <span className="text-[#00AEEF]">S.A.C.</span>
            </div>
            <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed max-w-sm mb-8">
              Empresa dedicada a la venta de productos y artículos de limpieza
              al por mayor y menor, trabajando con las mejores marcas para
              brindar seguridad y honestidad.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/distribuidoraproductoslimpiezayhoteleria#"
                target="_blank"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#00AEEF] transition-all group"
              >
                <Facebook
                  size={18}
                  className="text-slate-400 group-hover:text-white"
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#8CC63F] transition-all group"
              >
                <Instagram
                  size={18}
                  className="text-slate-400 group-hover:text-white"
                />
              </a>
              <a
                href="https://wa.me/51944339257"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#25D366] transition-all group"
              >
                <MessageCircle
                  size={18}
                  className="text-slate-400 group-hover:text-white"
                />
              </a>
            </div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <div className="md:col-span-3 space-y-6">
            <h5 className="text-[10px] uppercase tracking-[0.3em] text-[#8CC63F] font-black">
              Navegación
            </h5>
            <ul className="space-y-4">
              {EXPLORE.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-300 hover:text-[#00AEEF] transition-colors font-bold uppercase tracking-wider"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMNA 3: CONTACTO E INFO LEGAL */}
          <div className="md:col-span-4 space-y-6">
            <h5 className="text-[10px] uppercase tracking-[0.3em] text-[#8CC63F] font-black">
              Sede Principal
            </h5>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-[#00AEEF] shrink-0" />
                <p className="text-sm text-slate-300 font-medium">
                  San Juan de Lurigancho, <br />
                  Lima — Perú
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Mail size={20} className="text-[#00AEEF] shrink-0" />
                <a
                  href="mailto:mygserviciosgenerales@gmail.com"
                  className="text-sm text-slate-300 hover:text-white transition-colors break-all"
                >
                  mygserviciosgenerales@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={20} className="text-[#00AEEF] shrink-0" />
                <span className="text-sm text-slate-300 font-bold">
                  +51 944 339 257
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BARRA INFERIOR: COPYRIGHT */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black">
              M&G S.A.C. Servicios Generales
            </span>
            <span className="text-[9px] text-slate-600 uppercase tracking-widest">
              RUC: 20608552171 — Distribuidora de Limpieza
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-[#8CC63F]" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
              © 2026 Todos los derechos reservados
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
