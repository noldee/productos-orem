"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

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
      "*NUEVA CONSULTA - M&G S.A.C.*",
      `_Fecha: ${fecha}_`,
      "----------------------------",
      `*Nombre:* ${nombre.toUpperCase()}`,
      `*Email:* ${correo || "N/A"}`,
      "----------------------------",
      "*Mensaje:*",
      `_${mensaje}_`,
      "----------------------------",
      "*Distribuidora M&G*",
      "_Servicios Generales de Limpieza_",
    ].join("\n");

    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(lineasMensaje)}`;
    window.open(url, "_blank");

    setNombre("");
    setCorreo("");
    setMensaje("");
  };

  return (
    <section className="py-20 md:py-32 px-6 relative font-lato" id="contacto">
      <div className="max-w-6xl mx-auto">
        {/* CABECERA */}
        <div className="mb-16 text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#8CC63F] mb-4 block font-black">
            Canales de atención
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.85] uppercase tracking-tighter">
            ¿Listo para <br />
            <span className="text-[#00AEEF]">hacer tu pedido?</span>
          </h2>
          <p className="text-slate-500 font-light text-base max-w-md mx-auto mt-6 leading-relaxed">
            Estamos en San Juan de Lurigancho. Escríbenos y un asesor te
            atenderá personalmente por WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* COLUMNA FORMULARIO (8 columnas) */}
          <div className="lg:col-span-8 p-8 md:p-14 rounded-[3.5rem] relative overflow-hidden flex flex-col bg-[#1a1a18] shadow-2xl group">
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00AEEF]/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />

            <h3 className="text-4xl md:text-5xl text-white font-black uppercase mb-10 leading-tight tracking-tighter">
              Envíanos un <br />
              <span className="text-[#8CC63F]">Mensaje</span>
            </h3>

            <form
              className="space-y-6 relative z-10 w-full"
              onSubmit={enviarAWhatsApp}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 ml-2 block font-bold">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]/20 transition-all text-white placeholder:text-slate-600 font-light"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 ml-2 block font-bold">
                    Correo (Opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]/20 transition-all text-white placeholder:text-slate-600 font-light"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 ml-2 block font-bold">
                  ¿Qué productos necesitas?
                </label>
                <textarea
                  placeholder="Escribe aquí tu lista de pedidos o consulta..."
                  rows={4}
                  value={mensaje}
                  onChange={(e) => setNombre(e.target.value)} // Corregido: setMensaje
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#00AEEF] focus:ring-1 focus:ring-[#00AEEF]/20 transition-all text-white placeholder:text-slate-600 font-light resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-[#00AEEF] text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-2xl px-12 py-5 flex items-center justify-center gap-4 hover:bg-[#8CC63F] hover:text-[#1a1a18] transition-all duration-500 "
              >
                <MessageCircle size={18} />
                <span>Iniciar pedido vía WhatsApp</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* COLUMNA INFO (4 columnas) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* CARD INFO CONTACTO */}
            <div className="p-8 rounded-[3rem] border border-slate-100 flex flex-col bg-slate-50/50 flex-1 group hover:border-[#00AEEF]/30 transition-all duration-500">
              <div className="relative aspect-video lg:aspect-square rounded-[2rem] overflow-hidden shadow-lg mb-8 border-4 border-white">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1681487870238-4a2dfddc6bcb?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Atención al cliente M&G"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="space-y-5">
                <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900">
                  Contacto Directo
                </h4>

                <div className="flex items-start gap-4 text-slate-600 group/item">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-[#00AEEF] group-hover/item:bg-[#00AEEF] group-hover/item:text-white transition-colors">
                    <Mail size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      Email
                    </span>
                    <span className="text-xs break-all font-medium">
                      mygserviciosgenerales@gmail.com
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-slate-600 group/item">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-[#8CC63F] group-hover/item:bg-[#8CC63F] group-hover/item:text-white transition-colors">
                    <Phone size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      Teléfono
                    </span>
                    <span className="text-xs font-medium">+51 944 339 257</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-slate-600 group/item">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-[#00AEEF] group-hover/item:bg-[#00AEEF] group-hover/item:text-white transition-colors">
                    <MapPin size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      Ubicación
                    </span>
                    <span className="text-xs font-medium">
                      S.J.L, Lima - Perú
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD HORARIOS */}
            <div className="p-8 rounded-[2.5rem] bg-[#8CC63F] text-[#1a1a18] relative overflow-hidden group shadow-lg shadow-[#8CC63F]/20">
              <Clock className="absolute -bottom-6 -right-6 text-black/10 w-32 h-32 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              <h4 className="text-xl font-black uppercase tracking-tighter mb-2 relative z-10">
                Horario Comercial
              </h4>
              <p className="font-light text-slate-900/80 text-sm relative z-10 leading-tight">
                Lunes a Viernes <br />
                <span className="font-black text-lg">9:00 am - 6:00 pm</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
