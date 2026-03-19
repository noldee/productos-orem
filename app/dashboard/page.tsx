"use client";

import { useState } from "react";
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
import { useTheme } from "next-themes"; // Importante para detectar el modo

const monthlyData = [
  { month: "Ene", views: 4500 },
  { month: "Feb", views: 5200 },
  { month: "Mar", views: 3800 },
  { month: "Abr", views: 6100 },
  { month: "May", views: 5900 },
  { month: "Jun", views: 7200 },
];

export default function DashboardPage() {
  const [loading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Configuración de colores dinámica
  const colors = {
    celeste: "#00aeef",
    musgo: "#8cc63f",
    // Color para las barras que no están seleccionadas (ajustado para modo claro)
    barInactive: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    // Color de las líneas de la cuadrícula
    grid: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    // Color del texto de los ejes
    text: isDark ? "#94a3b8" : "#64748b",
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-background text-foreground p-6 md:p-12 font-sans selection:bg-primary/30 transition-colors duration-500">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header con estilo ORE M */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <div className="w-8 h-[2px] bg-primary"></div>
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
                M&G Catálogo
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
          className="bg-card border border-border rounded-[2.5rem] p-8 relative overflow-hidden transition-all"
        >
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Tráfico Mensual
                <ArrowUpRight size={18} className="text-[#8cc63f]" />
              </h2>
              <p className="text-sm text-muted-foreground">
                Vistas totales por mes
              </p>
            </div>
          </div>

          <div className="h-[400px] w-full relative z-10">
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
                  height={60}
                  tick={(props) => {
                    const { x, y, payload } = props;
                    return (
                      <text
                        x={x}
                        y={y}
                        dy={16} // Ajuste fino de posición vertical
                        fill="var(--muted-foreground)" // Usamos tu variable del CSS
                        fontSize={11}
                        fontWeight={500}
                        textAnchor="middle"
                        className="fill-muted-foreground" // Refuerzo con Tailwind
                      >
                        {payload.value}
                      </text>
                    );
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.text, fontSize: 12 }}
                />
                <Tooltip
                  cursor={{
                    fill: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.02)",
                  }}
                  contentStyle={{
                    backgroundColor: isDark ? "#171717" : "#ffffff",
                    borderRadius: "20px",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid rgba(0,0,0,0.05)",
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.2)",
                    padding: "12px 16px",
                  }}
                  itemStyle={{
                    color: colors.celeste,
                    fontWeight: "900",
                    fontSize: "14px",
                  }}
                  labelStyle={{
                    color: colors.text,
                    marginBottom: "4px",
                    fontWeight: "bold",
                  }}
                />
                <Bar dataKey="views" radius={[12, 12, 4, 4]} barSize={55}>
                  {monthlyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === monthlyData.length - 1
                          ? colors.celeste
                          : colors.barInactive
                      }
                      className="transition-all duration-500 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Footer con tus marcas */}
        <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold px-2">
          <p className="hover:text-primary transition-colors cursor-default">
            M&G Premium Cleaning
          </p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Status: Online
            </span>
            <span>v2.0.26</span>
          </div>
        </div>
      </div>
    </div>
  );
}
