"use client";

import { motion } from "framer-motion";

export function BrandsSection() {
  const brands = [
    "Hude",
    "Sapolio",
    "Clorox",
    "Elite",
    "Marsella",
    "Glade",
    "Baygon",
    "Daryza",
    "Suavitel",
    "Dento",
    "Poett",
    "Vanish",
  ];

  // Duplicamos las marcas para que no haya huecos al final
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section id="marcas" className="py-16 bg-white border-t border-slate-100 font-lato overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-slate-400 font-black">
          Marcas que respaldan nuestra calidad
        </p>
      </div>

      {/* Contenedor principal con máscara de degradado */}
      <div className="relative flex w-full">
        {/* Luces/Degradados laterales */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex w-max">
          <motion.div
            className="flex gap-16 md:gap-24 items-center pr-16 md:pr-24"
            animate={{
              x: ["0%", "-50%"], // Se mueve exactamente la mitad (el set original)
            }}
            transition={{
              ease: "linear",
              duration: 35, // Velocidad ajustable
              repeat: Infinity,
            }}
            // EL TRUCO: Usamos CSS para pausar la animación del motor del navegador
            // Esto evita que React tenga que recalcular la posición de 'x'
            style={{
              display: "flex",
              willChange: "transform",
            }}
            whileHover={{
              animationPlayState: "paused",
              // Usamos este hack de CSS directo para que Framer no intente re-renderizar
              transition: { duration: 0 },
            }}
          >
            {duplicatedBrands.map((brand, i) => (
              <span
                key={i}
                className="text-2xl md:text-4xl font-black text-slate-400 hover:text-[#00AEEF] transition-colors duration-300 uppercase tracking-tighter cursor-pointer select-none"
              >
                {brand}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Forzamos el comportamiento de pausa mediante CSS puro en el hover del contenedor */}
      <style jsx>{`
        div:hover > div {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
}
