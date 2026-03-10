"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, Mail, Phone, MapPin, Clock } from "lucide-react";

export function ContactSection() {
  // 1. Estados para guardar los datos del formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  // 2. Función para enviar a WhatsApp
  const enviarAWhatsApp = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue

    // Validar que no esté vacío
    if (!nombre.trim() || !mensaje.trim()) {
      alert("Por favor, ingresa al menos tu nombre y un mensaje.");
      return;
    }

    // Tu número de WhatsApp (Código de país + número, sin el '+')
    const NUMERO_WHATSAPP = "51944339257"; // <-- ¡CAMBIA ESTO!

    // Construir el mensaje con formato (usando %0A para saltos de línea y * para negritas)
    const textoMensaje = `¡Hola! Vengo de la página web Servicios Generales Ore M & G S.A.C.*Nombre:* ${nombre}%0A*Correo:* ${correo || 'No especificado'}%0A*Mensaje:* ${mensaje}`;
    
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${textoMensaje}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(url, "_blank");
    
    // Opcional: Limpiar el formulario después de enviar
    setNombre("");
    setCorreo("");
    setMensaje("");
  };

  return (
    <section className="py-20 md:py-32 px-6 relative" id="contacto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] relative overflow-hidden flex flex-col bg-negro">
          <h3 className="font-serif text-4xl md:text-5xl text-white italic mb-4 leading-tight">
            Ponte en <br />
            <span className="text-salvia not-italic">Contacto</span>
          </h3>
          <p className="font-sans text-stone-400 max-w-md font-light leading-relaxed mb-8">
            ¿Tienes alguna duda sobre nuestros productos o tu suscripción? Escríbenos y te responderemos por WhatsApp lo antes posible.
          </p>

          <form className="space-y-4 relative z-10 w-full" onSubmit={enviarAWhatsApp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full bg-transparent border border-stone-700 rounded-2xl px-6 py-4 outline-none focus:border-salvia transition-colors text-white placeholder:text-stone-500 font-light"
              />
              <input 
                type="email" 
                placeholder="Tu correo electrónico (Opcional)"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full bg-transparent border border-stone-700 rounded-2xl px-6 py-4 outline-none focus:border-salvia transition-colors text-white placeholder:text-stone-500 font-light"
              />
            </div>
            <textarea 
              placeholder="¿En qué te podemos ayudar?" 
              rows={4}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
              className="w-full bg-transparent border border-stone-700 rounded-2xl px-6 py-4 outline-none focus:border-salvia transition-colors text-white placeholder:text-stone-500 font-light resize-none"
            ></textarea>
            
            <button 
              type="submit" 
              className="bg-salvia text-negro font-medium rounded-2xl px-8 py-4 flex items-center justify-center gap-2 hover:bg-white transition-colors duration-300 w-full md:w-auto mt-2"
            >
              <span>Enviar por WhatsApp</span>
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Card derecha - Info de contacto directa */}
        <div className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-arena flex flex-col justify-between group hover:bg-stone-50 transition-all duration-700 bg-transparent">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-stone-100 group-hover:scale-110 transition-transform">
            <Mail size={28} className="text-musgo" />
          </div>
          <div className="mt-12 md:mt-0 space-y-4">
            <h4 className="font-serif text-3xl italic mb-6 text-negro">
              Escríbenos
            </h4>
            <div className="flex items-center gap-3 text-stone-500 font-light">
              <Mail size={18} className="text-salvia" />
              <span>mygserviciosgenerales@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 text-stone-500 font-light">
              <Phone size={18} className="text-salvia" />
              <span>+51 944 339 257</span>
            </div>
            <div className="flex items-center gap-3 text-stone-500 font-light">
              <MapPin size={18} className="text-salvia" />
              <span>San Juan de Lurigancho, Lima - Perú</span>
            </div>
          </div>
        </div>

        {/* Horarios */}
        <div className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] flex flex-col justify-between text-white relative overflow-hidden bg-musgo min-h-[220px]">
          <Clock size={100} className="absolute -top-10 -right-10 opacity-10" />
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-md">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="font-serif text-3xl italic mb-1">Horarios</h4>
            <p className="font-sans font-light text-white/80">Lunes a Viernes<br/>9:00 am - 6:00 pm</p>
          </div>
        </div>

        <div className="md:col-span-2 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-arena flex flex-col sm:flex-row items-center gap-8 md:gap-10 bg-crema">
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl -rotate-3 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=400"
              alt="Atención al cliente"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-serif text-3xl italic mb-2 tracking-tight text-negro">
              Atención Personalizada
            </h4>
            <p className="font-sans text-stone-500 font-light text-sm max-w-md">
              Nuestro equipo está listo para asesorarte. Las consultas enviadas por WhatsApp se responden casi de inmediato en horario laboral.
            </p>
          </div>
        </div>
        
      </div>
    </section>
  );
}