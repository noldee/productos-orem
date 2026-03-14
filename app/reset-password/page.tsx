"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));
    const token = params.get("access_token");
    if (token) {
      setAccessToken(token);
    } else {
      setError("Enlace inválido o expirado. Solicita uno nuevo.");
    }
  }, []);

  const handleSubmit = async () => {
    if (!password || !confirm) return setError("Completa todos los campos");
    if (password.length < 6)
      return setError("La contraseña debe tener al menos 6 caracteres");
    if (password !== confirm) return setError("Las contraseñas no coinciden");
    if (!accessToken)
      return setError("Token inválido. Solicita un nuevo enlace.");

    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        accessToken,
        password,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Error al actualizar. El enlace puede haber expirado.");
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
            <Lock size={28} strokeWidth={1.5} />
          </div>
          <h2 className="text-5xl font-black text-white mb-6 leading-tight tracking-tighter uppercase">
            SEGURIDAD <br /> <span className="text-[#00AEEF]">RENOVADA.</span>
          </h2>
          <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400 font-bold leading-relaxed">
            Establece una nueva clave de acceso <br /> para tu cuenta
            empresarial.
          </p>
        </motion.div>

        <div className="absolute bottom-12 left-12 font-black text-xl text-slate-700 tracking-tighter uppercase">
          M&G S.A.C.
        </div>
      </div>

      {/* LADO DERECHO: Formulario */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md mb-12">
          <Link
            href="/login"
            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 hover:text-[#00AEEF] transition-colors"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Cancelar y volver
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#8CC63F]/10 text-[#8CC63F] mb-6">
                  <CheckCircle2 size={40} strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">
                  ¡Contraseña Lista!
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-8">
                  Tu acceso ha sido actualizado con éxito.
                </p>
                <div className="flex items-center justify-center gap-3 text-slate-400">
                  <div className="w-4 h-4 border-2 border-slate-200 border-t-[#00AEEF] rounded-full animate-spin" />
                  <span className="text-[10px] uppercase font-black tracking-widest">
                    Redirigiendo...
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form">
                <header className="mb-10">
                  <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase leading-none">
                    Nueva <br /> Contraseña
                  </h1>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                    Ingresa tus nuevas credenciales de acceso
                  </p>
                </header>

                <div className="space-y-5">
                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black ml-1">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        size={16}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 focus:border-[#00AEEF] focus:bg-white outline-none transition-all text-sm rounded-xl"
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black ml-1">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <ShieldCheck
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        size={16}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-[#00AEEF] focus:bg-white outline-none transition-all text-sm rounded-xl"
                        placeholder="Repite la contraseña"
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
                    disabled={loading || !accessToken}
                    className="group w-full py-4 bg-slate-900 text-white rounded-xl text-[11px] uppercase tracking-[0.2em] font-black hover:bg-[#00AEEF] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Actualizar Contraseña"
                    )}
                  </button>
                </div>

                <footer className="mt-12 pt-8 border-t border-slate-100 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4">
                    ¿Problemas con el enlace?
                  </p>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-900 hover:text-[#00AEEF] transition-colors"
                  >
                    Solicitar otro correo
                  </Link>
                </footer>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
