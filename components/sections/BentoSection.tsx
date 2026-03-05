import Image from "next/image";
import { Sparkles, ShieldCheck, Leaf, Globe } from "lucide-react";
import { TOKENS } from "@/lib/data";

export function BentoSection() {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card grande izquierda */}
        <div
          className="md:col-span-2 p-12 rounded-[3rem] relative overflow-hidden min-h-[400px] flex flex-col justify-end group"
          style={{ backgroundColor: TOKENS.negro }}
        >
          <div className="absolute top-12 right-12 w-24 h-24 border border-stone-700 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-1000">
            <Sparkles className="text-salvia" size={32} />
          </div>
          <h3 className="serif text-5xl text-white italic mb-6 leading-tight">
            Suscripción <br />
            <span className="text-salvia not-italic">Consciente</span>
          </h3>
          <p className="sans text-stone-400 max-w-sm font-light leading-relaxed">
            Recarga tus botellas de vidrio infinito y reduce el plástico en un
            85%. Un ciclo perfecto para tu hogar y el planeta.
          </p>
        </div>

        {/* Card derecha */}
        <div
          className="p-10 rounded-[3rem] border flex flex-col justify-between group hover:bg-white transition-colors duration-700"
          style={{ borderColor: TOKENS.arena }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-stone-100 group-hover:scale-110 transition-transform">
            <ShieldCheck size={28} className="text-musgo" />
          </div>
          <div>
            <h4 className="serif text-3xl italic mb-3">Grado Hospitalario</h4>
            <p className="sans text-sm text-stone-500 leading-relaxed font-light">
              Elimina el 99.9% de patógenos sin químicos agresivos.
            </p>
          </div>
        </div>

        {/* Card verde */}
        <div
          className="p-10 rounded-[3rem] flex flex-col justify-between text-white relative overflow-hidden"
          style={{ backgroundColor: TOKENS.musgo }}
        >
          <Globe size={100} className="absolute -top-10 -right-10 opacity-10" />
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-md">
            <Leaf size={24} />
          </div>
          <h4 className="serif text-3xl italic">Eco-Logística Lima</h4>
        </div>

        {/* Card fragancias */}
        <div
          className="md:col-span-2 p-10 rounded-[3rem] border flex items-center gap-10"
          style={{ borderColor: TOKENS.arena, backgroundColor: TOKENS.crema }}
        >
          <div className="relative hidden sm:block w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl rotate-3 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=400"
              alt="Fragancias"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <div>
            <h4 className="serif text-3xl italic mb-2 tracking-tight">
              Fragancias de Autor
            </h4>
            <p className="sans text-stone-500 font-light text-sm max-w-md">
              Desarrolladas por perfumistas locales usando aceites esenciales de
              la selva y los andes peruanos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
