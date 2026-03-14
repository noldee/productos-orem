"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans">
      {/* LADO IZQUIERDO: Branding Industrial */}
      <div className="hidden md:flex md:w-1/2 bg-[#0f172a] relative items-center justify-center p-12 overflow-hidden border-r border-slate-800">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#00AEEF 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#00AEEF]/10 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-sm"
        >
          <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00AEEF]/10 text-[#00AEEF] border border-[#00AEEF]/20">
            <ShieldCheck size={28} strokeWidth={1.5} />
          </div>
          <h2 className="text-5xl font-black text-white mb-6 leading-tight tracking-tighter uppercase">
            SOLUCIONES <br />{" "}
            <span className="text-[#00AEEF]">EFICIENTES.</span>
          </h2>
          <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400 font-bold leading-relaxed">
            Suministros Industriales y Servicios <br /> Generales de alta
            precisión.
          </p>
        </motion.div>

        <div className="absolute bottom-12 left-12 font-black text-xl text-slate-700 tracking-tighter">
          M&G S.A.C.
        </div>
      </div>

      {/* LADO DERECHO: Formulario */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md mb-12">
          <Link
            href="/"
            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 hover:text-[#00AEEF] transition-colors"
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
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">
              Bienvenido
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
              Identifícate para gestionar tus pedidos
            </p>
          </header>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black ml-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-[#00AEEF] focus:bg-white outline-none transition-all text-sm rounded-xl"
                  placeholder="usuario@mg-sac.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black">
                  Contraseña
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[9px] uppercase tracking-widest text-[#00AEEF] font-black hover:underline"
                >
                  ¿Olvidaste?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-[#00AEEF] focus:bg-white outline-none transition-all text-sm rounded-xl"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-red-500 font-black text-center bg-red-50 py-3 rounded-xl border border-red-100 uppercase tracking-tight"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group w-full py-4 bg-slate-900 text-white rounded-xl text-[11px] uppercase tracking-[0.2em] font-black hover:bg-[#00AEEF] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
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

          <footer className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4">
              ¿Cliente nuevo?
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-3 rounded-xl border-2 border-slate-100 text-[10px] uppercase tracking-widest font-black text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
            >
              Crear una cuenta empresarial
            </Link>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
