"use client";

import Image from "next/image";

export function AboutSection() {
  return (
    <section
      className="py-20 md:py-32 px-6 bg-white overflow-hidden font-lato"
      id="about"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* LADO TEXTO - Ahora aparece primero en móvil */}
        <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#8CC63F] font-bold block">
            Presentación
          </span>

          <h2 className="text-5xl md:text-6xl font-black leading-[0.95] text-slate-900 uppercase">
            ¿Quiénes <br />
            <span className="text-[#00AEEF]">Somos?</span>
          </h2>

          <div className="space-y-4 text-slate-600 font-light leading-relaxed text-base md:text-lg max-w-md">
            <p>
              Somos una{" "}
              <span className="font-bold text-slate-800">
                empresa distribuidora
              </span>{" "}
              dedicada a la venta de productos y artículos de limpieza,
              trabajando con las mejores marcas del mercado.
            </p>
            <p className="italic border-l-4 border-[#8CC63F] pl-4 py-1">
              "En M&G somos parte de la solución de sus necesidades, dándoles
              los mejores precios y seguimiento post venta".
            </p>
          </div>

          {/* Misión y Visión */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h5 className="text-sm font-black uppercase text-[#8CC63F] mb-2 tracking-widest">
                Misión
              </h5>
              <p className="text-xs text-slate-500 leading-normal">
                Satisfacer las necesidades de nuestros clientes generando
                bienestar y calidad en sus hogares a través de productos
                recomendados.
              </p>
            </div>
            <div>
              <h5 className="text-sm font-black uppercase text-[#00AEEF] mb-2 tracking-widest">
                Visión
              </h5>
              <p className="text-xs text-slate-500 leading-normal">
                Ser una empresa reconocida y recomendada por brindar seguridad y
                honestidad con servicios de excelente calidad.
              </p>
            </div>
          </div>
        </div>

        {/* LADO IMAGEN - Ahora aparece abajo en móvil (order-2) y a la izquierda en desktop (lg:order-1) */}
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
            <Image
              src="https://plus.unsplash.com/premium_photo-1678718607647-88dcf5826c48?q=80&w=388&auto=format&fit=crop"
              alt="M&G S.A.C. Distribuidora"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Badge flotante */}
          <div className="absolute -bottom-6 -right-4 md:-bottom-10 md:-right-10 w-32 h-32 md:w-40 md:h-40 bg-[#00AEEF] rounded-full flex items-center justify-center p-6 md:p-8 text-white text-center leading-tight rotate-6 shadow-2xl z-10">
            <p className="font-bold text-xs md:text-sm uppercase tracking-tight">
              Venta al por mayor y menor
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
