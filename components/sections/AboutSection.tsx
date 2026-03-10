"use client";

import Image from "next/image";

export function AboutSection() {
  return (
    /* CORRECCIÓN: Usamos bg-white nativo y un padding responsivo */
    <section
      className="py-20 md:py-32 px-6 bg-white overflow-hidden"
      id="about"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* LADO IMAGEN */}
        <div className="relative">
          <div className="relative aspect-[4/5] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1613274554329-70f997f5789f?q=80&w=800"
              alt="Nuestro origen"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Badge flotante corregido con Tailwind 4 */}
          <div className="absolute -bottom-6 -right-4 md:-bottom-10 md:-right-10 w-32 h-32 md:w-40 md:h-40 bg-terracota rounded-full flex items-center justify-center p-6 md:p-8 text-white text-center leading-tight rotate-12 shadow-2xl z-10">
            <p className="font-serif italic text-base md:text-lg">
              Hecho a mano en Lima
            </p>
          </div>
        </div>

        {/* LADO TEXTO */}
        <div className="space-y-6 md:space-y-8">
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-stone-400 font-semibold block">
            Nuestra Esencia
          </span>

          <h2 className="font-serif text-5xl md:text-6xl italic leading-[0.95] text-stone-900">
            No solo limpiamos <br />
            <span className="text-musgo not-italic">preservamos</span> <br />
            tu santuario.
          </h2>

          <p className="font-sans text-stone-500 font-light leading-relaxed text-base md:text-lg max-w-md">
            Productos.ORE M nació de la necesidad de elevar la higiene a una
            experiencia sensorial. Combinamos la precisión de la tecnología
            hospitalaria con la calidez de los aceites esenciales peruanos.
          </p>

          {/* Grid de stats con bordes corregidos */}
          <div className="pt-6 border-t border-stone-100 grid grid-cols-2 gap-8">
            <div>
              <h5 className="font-serif text-2xl italic text-musgo">100%</h5>
              <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">
                Biodegradable
              </p>
            </div>
            <div>
              <h5 className="font-serif text-2xl italic text-musgo">
                San Juan de Lurigancho
              </h5>
              <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">
                Nuestro Hub
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
