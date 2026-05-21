"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Bell,
  Shield,
  Cpu,
  Headphones,
  Phone,
  Terminal,
  Crown,
  Star,
  Activity,
  Sparkles,
  ChevronRight,
  Globe,
  MapPin,
  Briefcase,
  Calendar,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModdeTogle";
import { cn } from "@/lib/utils";

// --- DATOS REALES DE LOS DESARROLLADORES ---
const DEVELOPERS = [
  {
    name: "Walter",
    role: "Arquitecto de Software",
    phone: "+51972203511",
    formattedPhone: "+51 972 203 511",
    color: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  },
  {
    name: "Gerando",
    role: "Desarrollador Frontend",
    phone: "+51912947558",
    formattedPhone: "+51 912 947 558",
    color: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  },
  {
    name: "Yoel",
    role: "Desarrollador Backend",
    phone: "+51962384254",
    formattedPhone: "+51 962 384 254",
    color: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
  },
];

export default function ConfiguracionPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Redirección inteligente multiplataforma (Móvil llama / Desktop va a WhatsApp Web)
  const handleContact = (phoneNumber: string) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      window.open(
        `https://web.whatsapp.com/send?phone=${phoneNumber.replace("+", "")}&text=Hola,%20necesito%20soporte%20con%20el%20sistema%20de%20M%26G.`,
        "_blank",
      );
    }
  };

  if (!mounted) return null;

  // Roles dinámicos basados en tu correo de M&G
  const userEmail = user?.email?.toLowerCase() || "";
  let displayRole = "Desarrollador";

  if (userEmail === "mygserviciosgenerales@gmail.com") {
    displayRole = "Administradora";
  } else if (user?.role === "ADMIN") {
    displayRole = "Administrador";
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20">
      <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12 space-y-8">
        {/* ── SECCIÓN SUPERIOR: PERFIL (MISMA IDENTIDAD DE TARJETAS QUE TU APP) ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary to-cyan-400" />
          <div className="px-6 pb-8">
            <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-12 mb-6">
              <div className="relative group mx-auto md:mx-0">
                <div className="w-32 h-32 rounded-2xl bg-card p-1.5 shadow-xl border border-border">
                  <div className="w-full h-full rounded-xl bg-muted flex items-center justify-center border border-border">
                    <User size={48} className="text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-card rounded-full animate-pulse shadow-sm" />
              </div>

              <div className="flex-1 pb-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-2xl font-bold text-foreground">
                    {user?.email?.split("@")[0]}
                  </h1>
                  <Badge className="bg-primary/10 text-primary border-none font-bold text-xs hover:bg-primary/10">
                    <CheckCircle2 size={12} className="mr-1" /> ACTIVO AHORA
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Briefcase size={14} className="text-primary" />
                  <span className="text-foreground font-bold">
                    {displayRole}
                  </span>
                  <span className="opacity-60">• M&G Servicios Generales</span>
                </p>
              </div>

              <div className="flex gap-2 pb-2 w-full md:w-auto justify-center">
                <Button
                  variant="outline"
                  className="rounded-lg border-border bg-card hover:bg-muted font-bold text-xs h-10 shadow-sm text-foreground"
                >
                  EDITAR PERFIL
                </Button>
                <Button
                  onClick={logout}
                  variant="destructive"
                  className="rounded-lg font-bold text-xs h-10 shadow-lg shadow-destructive/10"
                >
                  <LogOut size={14} className="mr-2" /> CERRAR SESIÓN
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── COLUMNA IZQUIERDA: INFORMACIÓN LATERAL ── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6">
                Información General
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground opacity-60">
                      Correo Electrónico
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate max-w-[190px]">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground opacity-60">
                      Ubicación
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      Lima, Perú
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground opacity-60">
                      Miembro desde
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      Mayo 2026
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-xs font-black text-muted-foreground uppercase mb-4">
                  Ajustes de Interfaz
                </h4>
                <div className="flex items-center justify-between p-3 bg-muted rounded-xl border border-border">
                  <span className="text-xs font-bold text-foreground">
                    Modo Oscuro
                  </span>
                  <ModeToggle />
                </div>
              </div>
            </div>
          </div>

          {/* ── COLUMNA DERECHA: TABS COMPLETAMENTE INTEGRADOS ── */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="soporte" className="w-full">
              <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8 mb-8 overflow-x-auto scrollbar-hide">
                <TabsTrigger
                  value="soporte"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 pb-4 text-xs font-black uppercase tracking-widest transition-all text-muted-foreground"
                >
                  Soporte Técnico
                </TabsTrigger>
                <TabsTrigger
                  value="gestion"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 pb-4 text-xs font-black uppercase tracking-widest transition-all text-muted-foreground"
                >
                  Privilegios
                </TabsTrigger>
                <TabsTrigger
                  value="ia"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 pb-4 text-xs font-black uppercase tracking-widest transition-all text-muted-foreground"
                >
                  IA del Sistema
                </TabsTrigger>
              </TabsList>

              {/* SOPORTE TÉCNICO */}
              <TabsContent
                value="soporte"
                className="grid grid-cols-1 md:grid-cols-2 gap-4 outline-none"
              >
                {DEVELOPERS.map((dev, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between group hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm",
                          dev.color,
                        )}
                      >
                        {dev.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">
                          {dev.name}
                        </h4>
                        <p className="text-[11px] text-muted-foreground font-bold tracking-tight uppercase">
                          {dev.role}
                        </p>
                        <p className="text-xs font-mono text-muted-foreground opacity-80 mt-0.5">
                          {dev.formattedPhone}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleContact(dev.phone)}
                      variant="secondary"
                      className="rounded-full w-10 h-10 p-0 bg-muted hover:bg-primary hover:text-white transition-colors border-none"
                    >
                      <Phone size={16} />
                    </Button>
                  </div>
                ))}
              </TabsContent>

              {/* PRIVILEGIOS: EN ESPAÑOL Y CON LOS DOS ÚLTIMOS DESACTIVADOS */}
              <TabsContent value="gestion" className="space-y-4 outline-none">
                {[
                  {
                    label: "Dashboard Administrativo",
                    desc: "Gestión total de inventario, marcas y catálogos de aromas.",
                    active: true,
                  },
                  {
                    label: "Analítica de Ventas",
                    desc: "Reportes comerciales detallados y balances en tiempo real.",
                    active: false,
                  },
                  {
                    label: "Gestión de Personal",
                    desc: "Control absoluto de horarios, accesos y roles de usuarios.",
                    active: false,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-card border rounded-2xl gap-4 transition-all",
                      item.active
                        ? "border-border"
                        : "border-dashed border-border opacity-50",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-2 h-10 rounded-full",
                          item.active ? "bg-primary" : "bg-muted",
                        )}
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-sm text-foreground">
                            {item.label}
                          </p>
                          {!item.active && (
                            <Badge
                              variant="outline"
                              className="text-orange-500 border-orange-500/20 bg-orange-500/10 text-[9px] font-black px-2 py-0"
                            >
                              PRÓXIMAMENTE
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <Switch
                      disabled={true}
                      className="data-[state=checked]:bg-primary"
                      checked={item.active}
                    />
                  </div>
                ))}
              </TabsContent>

              {/* IA DEL SISTEMA: 100% ACOPLADO A TUS CLASES DE TARJETAS */}
              <TabsContent value="ia" className="outline-none">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm">
                  <div className="relative z-10 max-w-md space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-foreground">
                          M&G Neural IA
                        </h2>
                        <Badge
                          variant="outline"
                          className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10 font-bold text-[9px]"
                        >
                          EN DESARROLLO
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        Estamos entrenando un modelo inteligente diseñado a la
                        medida para optimizar la proyección de compras, predecir
                        el desabastecimiento de fragancias y automatizar tus
                        reportes internos de M&G Servicios Generales.
                      </p>
                    </div>
                    <div className="pt-2">
                      <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-xs px-6 h-10 shadow-md shadow-primary/10 border-none">
                        Unirse a la lista de espera
                      </Button>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 text-muted/40 pointer-events-none hidden md:block">
                    <Cpu size={200} strokeWidth={1} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* ── FOOTER ESTILO PHOENIX ── */}
        <footer className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground opacity-80">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span>M&G SERVICIOS GENERALES</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Activity size={10} /> SISTEMA SEGURO
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
