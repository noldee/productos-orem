"use client";

import Image from "next/image";

const brands = [
  { name: "Baygon", src: "/marcas/baygon.jpg", ext: "jpg" },
  { name: "Clorox", src: "/marcas/clorox.png", ext: "png" },
  { name: "Daryza", src: "/marcas/daryza.jpg", ext: "jpg" },
  { name: "Dayr", src: "/marcas/dayr.jpg", ext: "jpg" },
  { name: "Elite", src: "/marcas/elite.png", ext: "png" },
  { name: "Glade", src: "/marcas/glade.jfif", ext: "jfif" },
  { name: "Hude", src: "/marcas/hude.png", ext: "png" },
  { name: "Martell", src: "/marcas/martell.png", ext: "png" },
  { name: "Sapolio", src: "/marcas/sapolio.jpg", ext: "jpg" },
  { name: "Suavitel", src: "/marcas/suavitel.avif", ext: "avif" },
  { name: "Wine", src: "/marcas/wine.png", ext: "png" },
];

export function BrandsSection() {
  const doubled = [...brands, ...brands];

  return (
    <section
      id="marcas"
      className="py-16 bg-white border-t border-slate-100 overflow-hidden font-lato"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-slate-400 font-black">
          Marcas que respaldan nuestra calidad
        </p>
      </div>

      {/* Track */}
      <div className="relative brands-track">
        {/* Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Belt — sin padding en el contenedor */}
        <div className="flex w-max items-center py-3 animate-marquee-brands">
          {doubled.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
            className="flex-shrink-0 flex items-center justify-center px-10 md:px-14 py-2
  opacity-70 md:grayscale md:opacity-40 hover:grayscale-0 hover:opacity-100
  transition-all duration-300 cursor-pointer"
            >
              <Image
                src={brand.src}
                alt={brand.name}
                width={120}
                height={40}
                className="h-14 w-auto object-contain"
                unoptimized={brand.ext === "jfif" || brand.ext === "avif"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
