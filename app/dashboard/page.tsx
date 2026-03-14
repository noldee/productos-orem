"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import {
  Area,
  AreaChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Layers,
  Package,
  BarChart3,
  Zap,
  Loader2,
  Tag,
  Info,
  ArrowUpRight,
  Download,
  ShoppingBag,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.19, 1, 0.22, 1] },
  }),
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-stone-200 shadow-xl rounded-lg p-3">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
          {label}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-8"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-stone-600 font-medium">
                  {entry.name}:
                </span>
              </div>
              <span className="text-xs font-bold text-stone-900">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .get("/stats/summary")
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    setIsExporting(true);
    try {
      pdfRef.current.style.display = "block";
      await new Promise((r) => setTimeout(r, 400));

      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        width: 794,
      });

      pdfRef.current.style.display = "none";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(
        `Reporte_ORE_M_${new Date().toLocaleDateString("es-PE").replace(/\//g, "-")}.pdf`,
      );
    } finally {
      if (pdfRef.current) pdfRef.current.style.display = "none";
      setIsExporting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
      </div>
    );

  if (!stats) return null;

  const enrichedLineaData = stats.productsByLinea.map((item: any) => ({
    ...item,
    meta: Math.floor(item.count * 1.2) + 2,
    rendimiento: Math.floor(item.count * 0.8),
  }));

  const totalViews = stats.topProducts.reduce(
    (acc: number, p: any) => acc + p.views,
    0,
  );

  return (
    <>
      {/* ═══════════════════════════════════════
          PÁGINA NORMAL DEL DASHBOARD
      ═══════════════════════════════════════ */}
      <div className="w-full min-h-screen bg-[#fbfbfa] text-stone-900 p-6 md:p-12 font-sans">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between pb-6 border-b border-stone-100">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">
                  Panel de Control
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                  Bienvenido de vuelta 👋
                </h1>
                <p className="text-stone-400 mt-1 text-sm">
                  Aquí tienes un resumen del estado actual de tu catálogo.
                </p>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="hidden md:flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-700 transition-all disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Download size={14} />
                )}
                Exportar PDF
              </button>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Productos Activos",
                val: stats.activeProducts,
                sub: `de ${stats.totalProducts} total`,
                icon: Package,
                dark: true,
              },
              {
                label: "Líneas",
                val: stats.productsByLinea.length,
                sub: "líneas de producto",
                icon: Layers,
                dark: false,
              },
              {
                label: "Categorías",
                val: stats.productsByCategory.length,
                sub: "categorías activas",
                icon: Tag,
                dark: false,
              },
              {
                label: "Vistas Totales",
                val: totalViews,
                sub: "en todos los productos",
                icon: Zap,
                dark: false,
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className={`p-5 rounded-2xl flex flex-col gap-3 ${card.dark ? "bg-stone-900 text-white" : "bg-white border border-stone-100"}`}
              >
                <div className="flex items-center justify-between">
                  <card.icon size={18} className="opacity-50" />
                  <ArrowUpRight size={13} className="opacity-30" />
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight">
                    {card.val}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest mt-1 opacity-50">
                    {card.label}
                  </p>
                  <p className="text-xs mt-0.5 opacity-40">{card.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gráfico principal */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-white border border-stone-100 rounded-2xl p-8 shadow-sm"
          >
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-bold text-lg tracking-tight flex items-center gap-2">
                  <BarChart3 size={18} className="text-stone-400" />{" "}
                  Distribución por Línea
                </h2>
                <p className="text-sm text-stone-400 italic mt-1">
                  Stock actual vs capacidad estimada
                </p>
              </div>
              <div className="hidden md:flex gap-4">
                {[
                  ["#1c1917", "Actual"],
                  ["#e7e5e4", "Meta"],
                  ["#a8a29e", "Rendimiento"],
                ].map(([color, label]) => (
                  <div key={label} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[10px] font-bold uppercase text-stone-400">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={enrichedLineaData}>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#f5f5f4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#a8a29e", fontSize: 11 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#a8a29e", fontSize: 11 }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#fbfbfa" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#1c1917"
                    radius={[4, 4, 0, 0]}
                    barSize={36}
                  />
                  <Area
                    type="monotone"
                    dataKey="meta"
                    fill="#f5f5f4"
                    stroke="#e7e5e4"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="stepAfter"
                    dataKey="rendimiento"
                    stroke="#a8a29e"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "#fff",
                      stroke: "#1c1917",
                      strokeWidth: 2,
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categorías */}
            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="bg-white border border-stone-100 rounded-2xl p-8"
            >
              <h3 className="font-bold text-stone-900 mb-6 flex items-center gap-2">
                <Tag size={16} /> Resumen de Categorías
              </h3>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.productsByCategory}>
                    <defs>
                      <linearGradient id="catGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#1c1917"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#1c1917"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f5f5f4"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#a8a29e", fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#1c1917"
                      fill="url(#catGrad)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Top productos */}
            <motion.div
              custom={6}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="bg-stone-900 text-white rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Info size={100} />
              </div>
              <h3 className="font-bold mb-6 text-stone-400 uppercase tracking-[0.2em] text-[10px]">
                Top Productos
              </h3>
              <div className="space-y-4">
                {stats.topProducts
                  .slice(0, 3)
                  .map((product: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b border-white/10 pb-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-stone-800 overflow-hidden border border-white/10 flex-shrink-0">
                          {product.img ? (
                            <img
                              src={product.img}
                              alt=""
                              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag
                                size={14}
                                className="text-stone-600"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{product.name}</p>
                          <p className="text-[10px] text-stone-500 font-mono">
                            RANK_0{i + 1}
                          </p>
                        </div>
                      </div>
                      <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold">
                        {product.views} vistas
                      </span>
                    </div>
                  ))}
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="w-full mt-6 py-3 bg-white text-stone-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 md:hidden"
              >
                {isExporting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Download size={14} />
                )}
                Exportar PDF
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          CONTENIDO OCULTO — SOLO PARA EL PDF
          (Se muestra momentáneamente al exportar)
      ═══════════════════════════════════════ */}
      <div
        ref={pdfRef}
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: "-9999px",
          width: "794px",
          backgroundColor: "#ffffff",
          padding: "48px",
          fontFamily: "sans-serif",
          color: "#1c1917",
          zIndex: -1,
        }}
      >
        {/* Cabecera */}
        <div
          style={{
            borderBottom: "2px solid #e7e5e4",
            paddingBottom: "32px",
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#a8a29e",
              marginBottom: "8px",
            }}
          >
            Reporte de Inventario · ORE M ·{" "}
            {new Date().toLocaleDateString("es-PE")}
          </p>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Estimada Ore M,
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#78716c",
              marginTop: "12px",
              lineHeight: 1.8,
              maxWidth: "600px",
            }}
          >
            Adjunto encontrará el análisis detallado del inventario
            correspondiente a la fecha actual. Se incluyen métricas de stock
            activo, distribución por líneas y categorías, y el ranking de
            productos con mayor engagement.
          </p>
        </div>

        {/* KPIs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          {[
            { label: "Productos Activos", val: stats.activeProducts },
            { label: "Líneas", val: stats.productsByLinea.length },
            { label: "Categorías", val: stats.productsByCategory.length },
            { label: "Vistas Totales", val: totalViews },
          ].map((k, i) => (
            <div
              key={i}
              style={{
                background: i === 0 ? "#1c1917" : "#f5f5f4",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <p
                style={{
                  fontSize: "8px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: i === 0 ? "#78716c" : "#a8a29e",
                  margin: 0,
                }}
              >
                {k.label}
              </p>
              <p
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: i === 0 ? "#ffffff" : "#1c1917",
                  margin: "4px 0 0 0",
                  letterSpacing: "-0.02em",
                }}
              >
                {k.val}
              </p>
            </div>
          ))}
        </div>

        {/* Gráfico líneas */}
        <div
          style={{
            background: "#f5f5f4",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#78716c",
              marginBottom: "12px",
            }}
          >
            Distribución por Línea de Producto
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={enrichedLineaData}>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#e7e5e4"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#a8a29e", fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#a8a29e", fontSize: 10 }}
              />
              <Bar
                dataKey="count"
                fill="#1c1917"
                radius={[4, 4, 0, 0]}
                barSize={28}
              />
              <Area
                type="monotone"
                dataKey="meta"
                fill="#e7e5e4"
                stroke="#d6d3d1"
                strokeDasharray="5 5"
              />
              <Line
                type="stepAfter"
                dataKey="rendimiento"
                stroke="#a8a29e"
                strokeWidth={1.5}
                dot={{ r: 3, fill: "#fff", stroke: "#1c1917" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico categorías */}
        <div
          style={{
            background: "#f5f5f4",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#78716c",
              marginBottom: "12px",
            }}
          >
            Distribución por Categoría
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={stats.productsByCategory}>
              <defs>
                <linearGradient id="pdfCatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1c1917" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1c1917" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e7e5e4"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#a8a29e", fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#a8a29e", fontSize: 10 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#1c1917"
                fill="url(#pdfCatGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top productos */}
        <div
          style={{
            background: "#1c1917",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "28px",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#78716c",
              marginBottom: "16px",
            }}
          >
            Top Productos por Visualizaciones
          </p>
          {stats.topProducts.slice(0, 5).map((p: any, i: number) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                paddingBottom: "10px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span
                  style={{
                    fontSize: "9px",
                    color: "#57534e",
                    fontFamily: "monospace",
                  }}
                >
                  0{i + 1}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {p.name}
                </span>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#a8a29e",
                  background: "rgba(255,255,255,0.08)",
                  padding: "3px 10px",
                  borderRadius: "20px",
                }}
              >
                {p.views} vistas
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #e7e5e4",
            paddingTop: "16px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "9px", color: "#a8a29e", fontStyle: "italic" }}>
            Generado automáticamente · Sistema ORE M
          </p>
          <p style={{ fontSize: "9px", color: "#a8a29e" }}>
            {new Date().toLocaleDateString("es-PE")}
          </p>
        </div>
      </div>
    </>
  );
}
