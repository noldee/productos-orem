"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  CheckCircle2,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return setError("Llena todos los campos");
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans">
      <div className="hidden md:flex md:w-1/2 bg-slate-50 relative items-center justify-center p-12 overflow-hidden border-r border-slate-100">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Building2 size={400} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-sm"
        >
          <h2 className="text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tighter uppercase">
            ÚNETE A <br /> <span className="text-[#8CC63F]">LA RED.</span>
          </h2>
          <div className="space-y-5">
            {[
              "Precios mayoristas exclusivos",
              "Gestión de facturación inmediata",
              "Stock garantizado para empresas",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-4 text-slate-600 font-bold text-[10px] uppercase tracking-widest"
              >
                <div className="bg-[#8CC63F]/10 p-2 rounded-lg text-[#8CC63F]">
                  <CheckCircle2 size={18} />
                </div>
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md mb-8">
          <Link
            href="/login"
            className="group flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Volver al inicio
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <header className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">
              Crear Cuenta
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
              Registro para nuevos aliados comerciales
            </p>
          </header>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Nombre o Razón Social */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black ml-1">
                Nombre o Razón Social
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-slate-900 bg-slate-50 border border-slate-100 focus:border-[#8CC63F] rounded-xl outline-none text-sm transition-all"
                  placeholder="Ej: Constructora M&G"
                />
              </div>
            </div>

            {/* Correo Electrónico */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black ml-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-slate-900 bg-slate-50 border border-slate-100 focus:border-[#8CC63F] rounded-xl outline-none text-sm transition-all"
                  placeholder="admin@empresa.com"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black ml-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-slate-900 bg-slate-50 border border-slate-100 focus:border-[#8CC63F] rounded-xl outline-none text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] text-red-600 font-black text-center bg-red-50 py-3 rounded-xl uppercase tracking-tight border border-red-100"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-xl text-[11px] uppercase tracking-[0.2em] font-black hover:bg-[#8CC63F] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verificando Datos..." : "Registrar Empresa"}
            </button>
          </form>

          <footer className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4">
              ¿Ya eres parte de M&G?
            </p>
            <Link
              href="/login"
              className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-900 hover:text-[#00AEEF] transition-colors"
            >
              Iniciar Sesión
            </Link>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
