"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { TOKENS } from "@/lib/data";
import { ArrowLeft, ArrowRight, Mail, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) return setError("Completa todos los campos");
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      router.push(user.role === "ADMIN" ? "/dashboard" : "/");
      router.refresh();
    } catch {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* LADO IZQUIERDO: Visual Branding */}
      <div className="hidden md:flex md:w-1/2 bg-stone-50 relative items-center justify-center p-12 overflow-hidden border-r border-stone-100">
        <div className="absolute top-[-5%] left-[-5%] w-72 h-72 rounded-full bg-musgo/5 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-sm"
        >
          <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm text-musgo">
            <ShieldCheck size={24} strokeWidth={1.5} />
          </div>
          <h2 className="font-serif italic text-6xl text-stone-900 mb-6 leading-[1.1]">
            Tu espacio, <br /> en buenas manos.
          </h2>
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-stone-400 leading-relaxed">
            Insumos premium para quienes buscan <br /> la excelencia en higiene.
          </p>
        </motion.div>

        <div className="absolute bottom-12 left-12 font-serif italic text-xl text-stone-300">
          Pureza.ORE M
        </div>
      </div>

      {/* LADO DERECHO: Formulario de Login */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-white">
        {/* Botón Volver */}
        <div className="w-full max-w-md mb-12 flex justify-start">
          <Link
            href="/"
            className="group flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 hover:text-negro transition-colors"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Regresar a la tienda
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <header className="mb-10">
            <h1 className="font-serif italic text-4xl md:text-5xl text-stone-900 mb-2">
              Bienvenido
            </h1>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone-400">
              Ingresa tus credenciales de acceso
            </p>
          </header>

          <div className="space-y-6">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-sans text-[9px] uppercase tracking-widest text-stone-400 font-bold ml-1">
                Correo Electrónico
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
                  className="w-full pl-8 pr-4 py-3 border-b border-stone-100 focus:border-musgo outline-none transition-all font-sans text-sm bg-transparent placeholder:text-stone-200"
                  placeholder="ejemplo@pureza.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="font-sans text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                  Contraseña
                </label>
                <Link
                  href="#"
                  className="text-[9px] uppercase tracking-widest text-musgo font-bold hover:underline"
                >
                  ¿Olvidaste?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300"
                  size={16}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full pl-8 pr-4 py-3 border-b border-stone-100 focus:border-musgo outline-none transition-all font-sans text-sm bg-transparent placeholder:text-stone-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-red-500 font-bold text-center bg-red-50 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group w-full py-4 mt-4 bg-negro text-crema rounded-full font-sans text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-stone-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </div>

          <footer className="mt-12 pt-8 border-t border-stone-50 text-center">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 mb-4">
              ¿Eres nuevo aquí?
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-3 rounded-full border border-stone-200 font-sans text-[10px] uppercase tracking-widest font-bold text-stone-600  hover:text-stone-800 transition-all active:scale-95"
            >
              Crear una cuenta
            </Link>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
