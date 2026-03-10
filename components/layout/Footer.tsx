"use client";

import { CATEGORIAS } from "@/lib/products";

const SOCIAL = ["Instagram", "LinkedIn"];
const EXPLORE = [
  "Catálogo Residencial",
  "Soluciones Corporativas",
  "Nuestro Manifiesto",
];

export function Footer() {
  return (
    /* CORRECCIÓN: bg-negro desde el theme y bordes redondeados amplios */
    <footer className="bg-negro pt-16 md:pt-32 pb-10 px-6 rounded-t-[2.5rem] md:rounded-t-[4rem]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 mb-16 md:mb-32">
          {/* Logo + descripción */}
          <div className="md:col-span-6">
            <div className="font-serif italic text-3xl md:text-5xl text-white mb-6 md:mb-10 tracking-tighter">
              Productos<span className="text-terracota">.ORE M</span>
            </div>
            <p className="font-sans text-stone-500 text-base md:text-xl font-light leading-relaxed max-w-md">
              Elevamos el estándar de los espacios peruanos a través de una
              limpieza con alma y propósito.
            </p>
          </div>

          {/* Links de Navegación */}
          <div className="grid grid-cols-2 md:contents gap-10">
            <div className="md:col-span-3 space-y-4 md:space-y-6">
              <h5 className="font-sans text-[10px] uppercase tracking-[0.3em] text-stone-600 font-bold">
                Explorar
              </h5>
              <ul className="space-y-3 md:space-y-4 font-sans text-sm text-stone-400 font-light">
                {EXPLORE.map((item) => (
                  <li
                    key={item}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3 space-y-4 md:space-y-6">
              <h5 className="font-sans text-[10px] uppercase tracking-[0.3em] text-stone-600 font-bold">
                Contacto
              </h5>
              <p className="font-sans text-sm text-stone-400 font-light leading-relaxed">
                San Juan de Lurigancho, Lima — Perú <br />
                <span className="hover:text-white transition-colors cursor-pointer">
                  mygserviciosgenerales@gmail.com
                </span>{" "}
                <br />
                +51 944 339 257
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 md:pt-10 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <span className="font-sans text-[9px] uppercase tracking-[0.5em] text-stone-600">
            © 2026 Servicios Generales Ore M & G S.A.C.
          </span>

          <div className="flex gap-8">
            {SOCIAL.map((s) => (
              <span
                key={s}
                className="font-sans text-[9px] uppercase tracking-widest text-stone-500 hover:text-white cursor-pointer transition-colors"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
