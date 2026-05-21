"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Loader2,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Package,
  Sparkles,
  Layers,
  Award,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// ── IMPORTAMOS TU INSTANCIA REAL DE AXIOS ──
import { api } from "@/lib/api";

interface Producto {
  id: number;
  name: string;
  desc: string;
  precio: number;
  precioMayor?: number | null;
  img: string;
  badge?: string | null;
  biodegradable: boolean;
  concentrado: boolean;
  active: boolean;
  categoryId: number;
  category?: { id: number; name: string };
  lineaId: number;
  linea?: { id: number; name: string };
  aromaId?: number | null;
  aroma?: { id: number; name: string } | null;
}

const MARCAS_REGISTRADAS = [
  { name: "Clorox", desc: "Desinfección" },
  { name: "Sapolio", desc: "Limpieza Hogar" },
  { name: "Daryza", desc: "Línea Profesional" },
  { name: "Suavitel", desc: "Cuidado Ropa" },
  { name: "Elite", desc: "Papeles e Higiene" },
  { name: "Glade", desc: "Aromatizantes" },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingAPI, setLoadingAPI] = useState(true);

  // ── FETCH USANDO TU INSTANCIA DE AXIOS ──
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);

    const fetchProductos = async () => {
      try {
        // Axios mapea automáticamente la URL base, solo le pasamos el endpoint relativo
        const response = await api.get("/products");

        // Axios guarda la respuesta del servidor directamente en .data
        if (response.data) {
          setProductos(response.data);
        }
      } catch (error) {
        console.error("Error cargando productos con Axios en M&G:", error);
      } finally {
        setLoadingAPI(false);
      }
    };

    fetchProductos();
    return () => clearInterval(timer);
  }, []);

  // ── PROCESAMIENTO DE TU MODELO DE PRISMA ──
  const { totalProductos, stockPorCategoria, totalLineas, totalAromas } =
    useMemo(() => {
      if (!productos || productos.length === 0) {
        return {
          totalProductos: 0,
          totalLineas: 0,
          totalAromas: 0,
          stockPorCategoria: [],
        };
      }

      const total = productos.length;
      const lineasUnicas = new Set(productos.map((p) => p.lineaId));
      const aromasUnicos = new Set(
        productos.map((p) => p.aromaId).filter(Boolean),
      );

      const conteoCategorias: Record<string, number> = {};

      productos.forEach((prod) => {
        const catName = prod.category?.name || `Categoría ${prod.categoryId}`;
        conteoCategorias[catName] = (conteoCategorias[catName] || 0) + 1;
      });

      const dataGrafico = Object.keys(conteoCategorias).map((key) => ({
        categoria: key,
        cantidad: conteoCategorias[key],
      }));

      return {
        totalProductos: total,
        totalLineas: lineasUnicas.size,
        totalAromas: aromasUnicos.size,
        stockPorCategoria: dataGrafico,
      };
    }, [productos]);

  const formattedDate = currentDateTime.toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const chartConfig = useMemo(() => {
    const isDark = resolvedTheme === "dark";
    return {
      primary: "#3874ff",
      inactive: isDark ? "#1e293b" : "#cbd5e1",
      grid: isDark ? "rgba(55, 69, 87, 0.15)" : "rgba(226, 232, 240, 0.6)",
      text: isDark ? "#94a3b8" : "#64748b",
      tooltipBg: isDark ? "#111625" : "#ffffff",
      tooltipBorder: isDark ? "#1e293b" : "#e2e8f0",
    };
  }, [resolvedTheme]);

  if (!mounted || loadingAPI)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 p-4 md:p-8 lg:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90">
                Panel de Control Activo · M&G
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Dashboard{" "}
              <span className="text-primary font-black">Overview</span>
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Sincronizado de forma segura mediante Axios e interceptores de
              sesión.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-muted p-3 rounded-xl border border-border">
            <div className="bg-primary/10 p-2.5 rounded-lg text-primary">
              <Calendar size={20} />
            </div>
            <div className="pr-4">
              <p className="text-[10px] uppercase font-black text-muted-foreground opacity-60 leading-none mb-1">
                Fecha Actual
              </p>
              <p className="text-sm font-bold capitalize text-foreground">
                {formattedDate}
              </p>
            </div>
          </div>
        </header>

        {/* TARJETAS CON DATA REAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Productos Registrados",
              val: `${totalProductos} Ítems`,
              sub: "Cargados desde Axios",
              icon: <Package size={18} />,
              color: "text-blue-500",
              bg: "bg-blue-500/10 border-blue-500/20",
            },
            {
              label: "Líneas Utilizadas",
              val: `${totalLineas} Mapeadas`,
              sub: "Relaciones mediante lineaId",
              icon: <Layers size={18} />,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10 border-emerald-500/20",
            },
            {
              label: "Variaciones de Aroma",
              val: `${totalAromas} Fragancias`,
              sub: "Asignados mediante aromaId",
              icon: <Sparkles size={18} />,
              color: "text-cyan-500",
              bg: "bg-cyan-500/10 border-cyan-500/20",
            },
            {
              label: "Marcas en Almacén",
              val: "9 Distribuciones",
              sub: "Gestión interna M&G",
              icon: <Award size={18} />,
              color: "text-purple-500",
              bg: "bg-purple-500/10 border-purple-500/20",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={cn("p-2.5 rounded-xl border", stat.bg, stat.color)}
                >
                  {stat.icon}
                </div>
                <Badge
                  variant="outline"
                  className="text-[9px] font-black border-border bg-muted text-muted-foreground"
                >
                  Axios Client
                </Badge>
              </div>
              <div>
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-0.5 tracking-tight">
                  {stat.val}
                </h3>
                <p className="text-[11px] font-medium text-muted-foreground opacity-80 mt-1 flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-emerald-500" />{" "}
                  {stat.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* GRÁFICO DINÁMICO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  Productos por Categoría Real
                  <ArrowUpRight size={16} className="text-primary" />
                </h2>
                <p className="text-xs font-medium text-muted-foreground">
                  Mapeo generado de forma dinámica desde tu base de datos
                  relacional.
                </p>
              </div>
            </div>

            <div className="p-6 h-[340px] w-full">
              {stockPorCategoria.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stockPorCategoria}
                    margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="0"
                      vertical={false}
                      stroke={chartConfig.grid}
                    />
                    <XAxis
                      dataKey="categoria"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: chartConfig.text,
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                      dy={12}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: chartConfig.text,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: chartConfig.inactive, opacity: 0.2 }}
                      contentStyle={{
                        backgroundColor: chartConfig.tooltipBg,
                        borderRadius: "12px",
                        border: `1px solid ${chartConfig.tooltipBorder}`,
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: resolvedTheme === "dark" ? "#f8fafc" : "#0f172a",
                      }}
                    />
                    <Bar
                      dataKey="cantidad"
                      name="Cantidad"
                      radius={[6, 6, 0, 0]}
                      barSize={28}
                    >
                      {stockPorCategoria.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index % 2 === 0
                              ? chartConfig.primary
                              : chartConfig.inactive
                          }
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                  No se encontraron productos en tu base de datos para graficar.
                  Asegúrate de incluir la relación `category` en tu API de
                  Prisma.
                </div>
              )}
            </div>
          </div>

          {/* MARCAS */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4">
                Marcas en Portafolio
              </h3>
              <p className="text-xs text-muted-foreground mb-6">
                Filtros estables asignados a las familias de productos de M&G.
              </p>
              <div className="space-y-3">
                {MARCAS_REGISTRADAS.map((marca, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="text-xs font-bold text-foreground">
                        {marca.name}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold text-muted-foreground border-border bg-card"
                    >
                      {marca.desc}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground opacity-80">
            <ShieldCheck size={14} className="text-primary" />
            <span>M&G SERVICIOS GENERALES S.A.C. · 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
