"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TOKENS } from "@/lib/data";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password)
      return setError("Por favor, llena todos los campos");
    setError("");
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/login");
    } catch (err) {
      setError("Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* LADO IZQUIERDO: Estética y Branding (Oculto en móvil) */}
      <div className="hidden md:flex md:w-1/2 bg-stone-50 relative items-center justify-center p-12 overflow-hidden">
        {/* Decoración abstracta de fondo */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-musgo/5 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-terracota/5 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-sm text-center md:text-left"
        >
          <h2 className="font-serif italic text-6xl text-stone-900 mb-6 leading-tight">
            Pureza en <br /> cada detalle.
          </h2>
          <div className="space-y-4">
            {[
              "Acceso a precios mayoristas",
              "Seguimiento de pedidos en tiempo real",
              "Catálogo exclusivo de suministros",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-stone-500 font-sans text-[11px] uppercase tracking-widest"
              >
                <CheckCircle2 size={16} className="text-musgo" />
                {text}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Marca de agua / Logo inferior */}
        <div className="absolute bottom-12 left-12 font-serif italic text-xl text-stone-300">
          Pureza.ORE M
        </div>
      </div>

      {/* LADO DERECHO: Formulario */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-16 bg-white">
        {/* Botón Volver (Mejorado) */}
        <div className="w-full max-w-md mb-8 flex justify-start">
          <Link
            href="/login"
            className="group flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 hover:text-negro transition-colors"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Volver
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <header className="mb-10">
            <h1 className="font-serif italic text-4xl md:text-5xl text-stone-900 mb-2">
              Crear Cuenta
            </h1>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone-400">
              Únete a nuestra red de suministros premium
            </p>
          </header>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="font-sans text-[9px] uppercase tracking-widest text-stone-400 font-bold ml-1">
                  Nombre
                </label>
                <div className="relative">
                  <User
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300"
                    size={16}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border-b border-stone-100 focus:border-musgo outline-none transition-all font-sans text-sm bg-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="font-sans text-[9px] uppercase tracking-widest text-stone-400 font-bold ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300"
                    size={16}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border-b border-stone-100 focus:border-musgo outline-none transition-all font-sans text-sm bg-transparent"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-1.5">
                <label className="font-sans text-[9px] uppercase tracking-widest text-stone-400 font-bold ml-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300"
                    size={16}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border-b border-stone-100 focus:border-musgo outline-none transition-all font-sans text-sm bg-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] text-red-500 font-bold text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-negro text-crema rounded-full font-sans text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-stone-800 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Registrarse Ahora"}
            </button>
          </form>

          <footer className="mt-12 pt-8 border-t border-stone-50 text-center">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 mb-4">
              ¿Ya tienes una cuenta?
            </p>
            <Link
              href="/login"
              className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-stone-900 hover:text-musgo transition-colors"
            >
              Iniciar Sesión
            </Link>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
