import Image from "next/image";
import { TOKENS } from "@/lib/data";

export function AboutSection() {
  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        {/* Imagen */}
        <div className="relative">
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1613274554329-70f997f5789f?q=80&w=800"
              alt="Nuestro origen"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="absolute  -bottom-10 -right-10 w-40 h-40 bg-terracota rounded-full flex items-center justify-center p-8 text-white text-center leading-tight rotate-12 shadow-2xl">
            <p className="serif italic text-lg">Hecho a mano en Lima</p>
          </div>
        </div>

        {/* Texto */}
        <div className="space-y-8">
          <span className="sans text-[10px] uppercase tracking-[0.4em] text-stone-400 font-semibold">
            Nuestra Esencia
          </span>
          <h2 className="serif text-6xl italic leading-[0.9] text-stone-900">
            No solo limpiamos <br />
            <span className="text-musgo not-italic">preservamos</span> <br />
            tu santuario.
          </h2>
          <p className="sans text-stone-500 font-light leading-relaxed text-lg max-w-md">
            Productos.ORE M nació de la necesidad de elevar la higiene a una experiencia
            sensorial. Combinamos la precisión de la tecnología hospitalaria con
            la calidez de los aceites esenciales peruanos.
          </p>
          <div className="pt-6 border-t border-stone-100 grid grid-cols-2 gap-8">
            <div>
              <h5 className="serif text-3xl italic text-musgo">100%</h5>
              <p className="sans text-[10px] uppercase tracking-widest text-stone-400">
                Biodegradable
              </p>
            </div>
            <div>
              <h5 className="serif text-3xl italic text-musgo">Lince</h5>
              <p className="sans text-[10px] uppercase tracking-widest text-stone-400">
                Nuestro Hub
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
