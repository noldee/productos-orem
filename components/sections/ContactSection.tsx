"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, MessageCircle, ArrowRight } from "lucide-react";

export function ContactSection() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const enviarAWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !mensaje.trim()) {
      alert("Por favor, ingresa al menos tu nombre y un mensaje.");
      return;
    }

    const NUMERO_WHATSAPP = "51944339257";
    const fecha = new Date().toLocaleDateString("es-PE");

    const lineasMensaje = [
      "*NUEVA CONSULTA - OREM BOTANICO*",
      `_Fecha: ${fecha}_`,
      "----------------------------",
      `*Nombre:* ${nombre.toUpperCase()}`,
      `*Email:* ${correo || "N/A"}`,
      "----------------------------",
      "*Mensaje:*",
      `_${mensaje}_`,
      "----------------------------",
      "*Web:* www.orem.com.pe",
      "----------------------------",
      "_Suministros Generales OREM_",
    ].join("\n");

    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(lineasMensaje)}`;
    window.open(url, "_blank");

    setNombre("");
    setCorreo("");
    setMensaje("");
  };

  return (
    <section className="py-20 md:py-32 px-6 relative" id="contacto">
      <div className="max-w-6xl mx-auto">

        {/* Título de sección */}
        <div className="mb-12 text-center">
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-4 block">
            Contáctanos
          </span>
          <h2 className="font-serif italic text-5xl md:text-6xl text-stone-900 leading-tight">
            Productos <span className="text-musgo not-italic">OreM</span>
          </h2>
          <p className="font-sans text-stone-500 font-light text-sm max-w-md mx-auto mt-4 leading-relaxed">
            Escríbenos y te responderemos por WhatsApp lo antes posible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FORMULARIO */}
          <div className="md:col-span-2 p-8 md:p-12 rounded-[3rem] relative overflow-hidden flex flex-col bg-negro shadow-2xl">
            <h3 className="font-serif text-4xl md:text-5xl text-white italic mb-8 leading-tight">
              Ponte en <br />
              <span className="text-salvia not-italic">Contacto</span>
            </h3>

            <form className="space-y-5 relative z-10 w-full" onSubmit={enviarAWhatsApp}>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 ml-2 block">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Juan Perez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl px-6 py-4 outline-none focus:border-salvia focus:ring-1 focus:ring-salvia/20 transition-all text-white placeholder:text-stone-700 font-light"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 ml-2 block">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl px-6 py-4 outline-none focus:border-salvia focus:ring-1 focus:ring-salvia/20 transition-all text-white placeholder:text-stone-700 font-light"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 ml-2 block">
                  Mensaje
                </label>
                <textarea
                  placeholder="¿En qué te podemos ayudar?"
                  rows={4}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  required
                  className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl px-6 py-4 outline-none focus:border-salvia focus:ring-1 focus:ring-salvia/20 transition-all text-white placeholder:text-stone-700 font-light resize-none"
                />
              </div>

              <button
                type="submit"
                className="group w-full md:w-auto bg-salvia text-negro font-sans text-[11px] uppercase tracking-[0.25em] font-bold rounded-2xl px-12 py-5 flex items-center justify-center gap-4 hover:bg-white transition-all duration-500"
              >
                <MessageCircle size={18} />
                <span>Enviar por WhatsApp</span>
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
            </form>
          </div>

          {/* INFO DERECHA */}
          <div className="flex flex-col gap-6">
            <div className="p-8 rounded-[2.5rem] border border-arena flex flex-col justify-between group hover:bg-stone-50 transition-all duration-700 bg-transparent flex-1">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white mb-8">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1706548332696-0e020917484c?q=80&w=387&auto=format&fit=crop"
                  alt="Contacto Productos OREM"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-4">
                <h4 className="font-serif text-2xl italic text-negro">Escríbenos</h4>
                <div className="flex items-center gap-3 text-stone-500 font-light text-sm">
                  <Mail size={16} className="text-salvia shrink-0" />
                  <span className="truncate">mygserviciosgenerales@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-stone-500 font-light text-sm">
                  <Phone size={16} className="text-salvia" />
                  <span>+51 944 339 257</span>
                </div>
                <div className="flex items-center gap-3 text-stone-500 font-light text-sm">
                  <MapPin size={16} className="text-salvia shrink-0" />
                  <span>S.J.L, Lima - Perú</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-musgo text-white relative overflow-hidden group">
              <Clock className="absolute -bottom-6 -right-6 text-white/10 w-32 h-32 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              <h4 className="font-serif text-2xl italic mb-2 relative z-10">Horarios</h4>
              <p className="font-sans font-light text-white/80 text-sm relative z-10">
                Lunes a Viernes <br />
                <span className="text-white font-medium">9:00 am - 6:00 pm</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
