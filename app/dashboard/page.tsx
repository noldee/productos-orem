"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Calendar, ArrowUpRight } from "lucide-react";
import { useTheme } from "next-themes";

const monthlyData = [
  { month: "Ene", views: 4500 },
  { month: "Feb", views: 5200 },
  { month: "Mar", views: 3800 },
  { month: "Abr", views: 6100 },
  { month: "May", views: 5900 },
  { month: "Jun", views: 7200 },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  // CONFIGURACIÓN DE COLORES DINÁMICA MEJORADA
  const colors = {
    celeste: "#00aeef",
    // En modo claro usamos un gris más fuerte para que no se pierda (slate-200/300)
    barInactive: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.15)",
    // Cuadrícula más definida en modo claro
    grid: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.08)",
    // Texto de ejes (slate-400 en oscuro, slate-500 en claro)
    text: isDark ? "#94a3b8" : "#64748b",
    tooltipBg: isDark ? "#171717" : "#ffffff",
    tooltipBorder: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground p-6 md:p-12 font-sans selection:bg-primary/30 transition-colors duration-500">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <div className="w-8 h-0.5 bg-primary"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                Analytics Pro
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Bienvenida,{" "}
              <span className="text-primary italic">Graciela Hernandez</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md">
              Visualiza el crecimiento de{" "}
              <span className="text-foreground font-medium underline decoration-primary/30">
                M&G Servicios Generales
              </span>{" "}
              a través de las interacciones mensuales.
            </p>
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Calendar className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase text-muted-foreground font-bold leading-none mb-1">
                Periodo Actual
              </p>
              <p className="text-sm font-semibold">Enero — Junio 2026</p>
            </div>
          </div>
        </motion.div>

        {/* Gráfico de Barras Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-[2.5rem] p-8 relative overflow-hidden transition-all shadow-xl shadow-black/3"
        >
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Tráfico Mensual
                <ArrowUpRight size={18} className="text-musgo" />
              </h2>
              <p className="text-sm text-muted-foreground">
                Vistas totales por mes
              </p>
            </div>
          </div>

          <div className="h-100 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 0, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke={colors.grid}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.text, fontSize: 11, fontWeight: 600 }}
                  height={50}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.text, fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  cursor={{
                    fill: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.04)",
                  }}
                  contentStyle={{
                    backgroundColor: colors.tooltipBg,
                    borderRadius: "16px",
                    border: `1px solid ${colors.tooltipBorder}`,
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
                    padding: "12px 16px",
                  }}
                  itemStyle={{
                    color: colors.celeste,
                    fontWeight: "800",
                    fontSize: "14px",
                  }}
                  labelStyle={{
                    color: colors.text,
                    marginBottom: "4px",
                    fontWeight: "bold",
                  }}
                />
                <Bar dataKey="views" radius={[10, 10, 4, 4]} barSize={50}>
                  {monthlyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === monthlyData.length - 1
                          ? colors.celeste
                          : colors.barInactive
                      }
                      className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold px-2 pb-6">
          <p className="hover:text-primary transition-colors cursor-default">
            M&G Servicios Generanles
          </p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Status: Online
            </span>
            <span>v1.0.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
