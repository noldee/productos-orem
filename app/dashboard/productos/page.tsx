"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { api } from "@/lib/api";
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  X,
  Loader2,
  ImagePlus,
  ChevronDown,
  Check,
  FileSpreadsheet,
  FileText,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Droplet,
  Zap,
  Tag,
  Filter,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

// ── Types ──────────────────────────────────────────────────────────────────────
interface SelectOption {
  id: number;
  name: string;
}
interface Product {
  id: number;
  name: string;
  desc: string;
  precio: number;
  precioMayor: number;
  img: string;
  badge?: string;
  biodegradable: boolean;
  concentrado: boolean;
  active: boolean;
  category?: any;
  linea?: any;
  aroma?: any;
  formato?: any;
  categoryId?: number;
  lineaId?: number;
}

const emptyForm = {
  name: "",
  desc: "",
  precio: "",
  precioMayor: "",
  img: "",
  badge: "",
  biodegradable: false,
  concentrado: false,
  categoryId: "",
  lineaId: "",
  aromaId: "",
  formatoId: "",
};

const BADGE_STYLES: Record<string, string> = {
  "Más vendido":
    "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  Nuevo:
    "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400",
  Oferta:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  Premium:
    "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400",
  Agotado:
    "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
};

const PAGE_SIZES = [10, 25, 50];

// ── Export helpers ─────────────────────────────────────────────────────────────
async function exportToExcel(products: Product[]) {
  const XLSX = await import("xlsx");
  const rows = products.map((p) => ({
    ID: p.id,
    Nombre: p.name,
    Descripción: p.desc,
    Categoría: p.category?.name ?? "—",
    Línea: p.linea?.name ?? "—",
    Aroma: p.aroma?.name ?? "—",
    Formato: p.formato?.name ?? "—",
    "Precio Unidad (S/)": Number(p.precio).toFixed(2),
    "Precio Mayor (S/)": Number(p.precioMayor).toFixed(2),
    Badge: p.badge ?? "—",
    Biodegradable: p.biodegradable ? "Sí" : "No",
    Concentrado: p.concentrado ? "Sí" : "No",
    Estado: p.active ? "Activo" : "Inactivo",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  // Column widths
  ws["!cols"] = [
    { wch: 6 },
    { wch: 32 },
    { wch: 40 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 10 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Catálogo M&G");
  XLSX.writeFile(
    wb,
    `catalogo-mg-${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
}

async function exportToPDF(products: Product[]) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 297, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("M&G Servicios Generales — Catálogo de Productos", 14, 14);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Generado: ${new Date().toLocaleDateString("es-PE", { dateStyle: "long" })}`,
    230,
    14,
  );

  autoTable(doc, {
    startY: 26,
    head: [
      [
        "#",
        "Producto",
        "Categoría",
        "Línea",
        "Precio Unit.",
        "Precio Mayor",
        "Badge",
        "Estado",
      ],
    ],
    body: products.map((p) => [
      p.id,
      p.name,
      p.category?.name ?? "—",
      p.linea?.name ?? "—",
      `S/ ${Number(p.precio).toFixed(2)}`,
      `S/ ${Number(p.precioMayor).toFixed(2)}`,
      p.badge ?? "—",
      p.active ? "Activo" : "Inactivo",
    ]),
    headStyles: {
      fillColor: [0, 174, 239],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 55 },
      2: { cellWidth: 30 },
      3: { cellWidth: 28 },
      4: { cellWidth: 24 },
      5: { cellWidth: 24 },
      6: { cellWidth: 22 },
      7: { cellWidth: 18 },
    },
    margin: { left: 14, right: 14 },
    styles: { overflow: "ellipsize", cellPadding: 2.5 },
  });

  doc.save(`catalogo-mg-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [lineas, setLineas] = useState<SelectOption[]>([]);
  const [aromas, setAromas] = useState<SelectOption[]>([]);
  const [formatos, setFormatos] = useState<SelectOption[]>([]);

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewImg, setPreviewImg] = useState("");
  const [exportLoading, setExportLoading] = useState<"excel" | "pdf" | null>(
    null,
  );
  const fileRef = useRef<HTMLInputElement>(null);

  // Table controls
  const [search, setSearch] = useState("");
  const [filterBadge, setFilterBadge] = useState("");
  const [filterActive, setFilterActive] = useState<"" | "true" | "false">("");
  const [sortCol, setSortCol] = useState<
    "name" | "precio" | "precioMayor" | ""
  >("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showFilters, setShowFilters] = useState(false);

  // ── Data ──
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [p, c, l, a, f] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/lineas"),
        api.get("/aromas"),
        api.get("/formatos"),
      ]);
      setProducts(Array.isArray(p.data) ? p.data : p.data?.data || []);
      setCategories(c.data || []);
      setLineas(l.data || []);
      setAromas(a.data || []);
      setFormatos(f.data || []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAll();
  }, []);

  // ── Stats ──
  const stats = useMemo(
    () => ({
      total: products.length,
      activos: products.filter((p) => p.active).length,
      agotados: products.filter((p) => p.badge === "Agotado").length,
      ofertas: products.filter((p) => p.badge === "Oferta").length,
    }),
    [products],
  );

  // ── Filtered + sorted + paginated ──
  const processed = useMemo(() => {
    let r = products.filter((p) => {
      const q = search.toLowerCase();
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !(p.category?.name ?? "").toLowerCase().includes(q) &&
        !(p.linea?.name ?? "").toLowerCase().includes(q)
      )
        return false;
      if (filterBadge && p.badge !== filterBadge) return false;
      if (filterActive === "true" && !p.active) return false;
      if (filterActive === "false" && p.active) return false;
      return true;
    });
    if (sortCol) {
      r = [...r].sort((a, b) => {
        const va = sortCol === "name" ? a.name : Number(a[sortCol]);
        const vb = sortCol === "name" ? b.name : Number(b[sortCol]);
        return sortDir === "asc"
          ? va < vb
            ? -1
            : va > vb
              ? 1
              : 0
          : va > vb
            ? -1
            : va < vb
              ? 1
              : 0;
      });
    }
    return r;
  }, [products, search, filterBadge, filterActive, sortCol, sortDir]).sort((a,b) => a.id - b.id);

  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const paginated = processed.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(col);
      setSortDir("asc");
    }
    setPage(1);
  };

  const SortIcon = ({ col }: { col: typeof sortCol }) => {
    if (sortCol !== col)
      return <ArrowUpDown size={12} className="ml-1 opacity-30" />;
    return sortDir === "asc" ? (
      <ArrowUp size={12} className="ml-1 text-[#00AEEF]" />
    ) : (
      <ArrowDown size={12} className="ml-1 text-[#00AEEF]" />
    );
  };

  // ── Form helpers ──
  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setPreviewImg("");
    setShowForm(true);
  };
  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      ...emptyForm,
      name: p.name || "",
      desc: p.desc || "",
      precio: String(p.precio || ""),
      precioMayor: p.precioMayor != null ? String(p.precioMayor) : "",
      img: p.img || "",
      badge: p.badge || "",
      biodegradable: !!p.biodegradable,
      concentrado: !!p.concentrado,
      categoryId: String(p.categoryId || p.category?.id || ""),
      lineaId: String(p.lineaId || p.linea?.id || ""),
      aromaId: String(p.aroma?.id || ""),
      formatoId: String(p.formato?.id || ""),
    });
    setPreviewImg(p.img || "");
    setShowForm(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/storage/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, img: data.url }));
      setPreviewImg(data.url);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.precio || !form.img) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        precio: Number(form.precio),
        precioMayor:
          form.precioMayor !== "" ? Number(form.precioMayor) : undefined,
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        lineaId: form.lineaId ? Number(form.lineaId) : undefined,
        aromaId: form.aromaId ? Number(form.aromaId) : undefined,
        formatoId: form.formatoId ? Number(form.formatoId) : undefined,
      };
      if (editingProduct)
        await api.put(`/products/${editingProduct.id}`, payload);
      else await api.post("/products", payload);
      setShowForm(false);
      fetchAll();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    await api.delete(`/products/${p.id}`);
    fetchAll();
  };

  const handleExport = async (type: "excel" | "pdf") => {
    setExportLoading(type);
    try {
      if (type === "excel") await exportToExcel(processed);
      else await exportToPDF(processed);
    } finally {
      setExportLoading(null);
    }
  };

  // ── Sub-components ──
  const SelectField = ({
    label,
    value,
    onChange,
    options,
    placeholder,
  }: any) => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[#00AEEF] pr-8 h-11 transition-colors"
        >
          <option value="">{placeholder}</option>
          {options.map((o: any) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>
    </div>
  );

  const getName = (
    item: any,
    list: SelectOption[],
    rel: string,
    idKey: string,
  ) => {
    if (item[rel]?.name) return item[rel].name;
    const id = item[idKey] || item[rel];
    return list.find((o) => o.id === id)?.name || "—";
  };

  // ── RENDER ──
  return (
    <div className="min-h-screen bg-[#f9fafd] dark:bg-[#0f111a] p-4 md:p-6 space-y-5">
      {/* ══ Stats Cards ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Productos",
            value: stats.total,
            icon: Package,
            color: "text-[#00AEEF]",
            bg: "bg-[#00AEEF]/10",
          },
          {
            label: "Activos",
            value: stats.activos,
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Agotados",
            value: stats.agotados,
            icon: XCircle,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
          },
          {
            label: "En Oferta",
            value: stats.ofertas,
            icon: TrendingUp,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
        ].map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                {value}
              </p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-0.5">
                {label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ══ Main Card ══ */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* ── Toolbar ── */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Catálogo de Productos
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {processed.length} resultado{processed.length !== 1 && "s"}
                {search && ` para "${search}"`}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* View toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
                {(["table", "grid"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === m ? "bg-white dark:bg-slate-700 shadow-sm text-[#00AEEF]" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    {m === "table" ? (
                      <List size={15} />
                    ) : (
                      <LayoutGrid size={15} />
                    )}
                  </button>
                ))}
              </div>

              {/* Export */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleExport("excel")}
                  disabled={!!exportLoading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest transition-all border border-emerald-200 dark:border-emerald-800 disabled:opacity-50"
                >
                  {exportLoading === "excel" ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <FileSpreadsheet size={13} />
                  )}
                  Excel
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  disabled={!!exportLoading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest transition-all border border-rose-200 dark:border-rose-800 disabled:opacity-50"
                >
                  {exportLoading === "pdf" ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <FileText size={13} />
                  )}
                  PDF
                </button>
              </div>

              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00AEEF] hover:bg-[#0099d4] text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm shadow-[#00AEEF]/30 active:scale-95"
              >
                <Plus size={14} /> Nuevo
              </button>
            </div>
          </div>

          {/* Search + Filter row */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar por nombre, categoría, línea..."
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#00AEEF] focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all ${showFilters ? "border-[#00AEEF] text-[#00AEEF] bg-[#00AEEF]/5" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 bg-slate-50 dark:bg-slate-800"}`}
            >
              <SlidersHorizontal size={13} /> Filtros
              {(filterBadge || filterActive) && (
                <span className="w-2 h-2 rounded-full bg-[#00AEEF]" />
              )}
            </button>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-3 pt-1 flex-wrap">
                  <div className="relative">
                    <select
                      value={filterBadge}
                      onChange={(e) => {
                        setFilterBadge(e.target.value);
                        setPage(1);
                      }}
                      className="appearance-none pl-3 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#00AEEF] font-bold"
                    >
                      <option value="">Todos los badges</option>
                      {[
                        "Más vendido",
                        "Nuevo",
                        "Oferta",
                        "Premium",
                        "Agotado",
                      ].map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={filterActive}
                      onChange={(e) => {
                        setFilterActive(e.target.value as any);
                        setPage(1);
                      }}
                      className="appearance-none pl-3 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#00AEEF] font-bold"
                    >
                      <option value="">Todos los estados</option>
                      <option value="true">Activos</option>
                      <option value="false">Inactivos</option>
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                  {(filterBadge || filterActive) && (
                    <button
                      onClick={() => {
                        setFilterBadge("");
                        setFilterActive("");
                        setPage(1);
                      }}
                      className="flex items-center gap-1 px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl font-bold transition-all"
                    >
                      <X size={12} /> Limpiar
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#00AEEF]" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Cargando catálogo...
            </p>
          </div>
        ) : processed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Package
                size={28}
                className="text-slate-300 dark:text-slate-600"
              />
            </div>
            <p className="text-slate-400 text-sm">
              No se encontraron productos.
            </p>
            <button
              onClick={openCreate}
              className="px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Crear el primero
            </button>
          </div>
        ) : viewMode === "table" ? (
          // ── TABLE VIEW ──
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-100 dark:border-slate-800">
                  <TableHead className="pl-6 w-16 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Img
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <button
                      onClick={() => toggleSort("name")}
                      className="flex items-center hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    >
                      Producto <SortIcon col="name" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Categoría / Línea
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <button
                      onClick={() => toggleSort("precio")}
                      className="flex items-center hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    >
                      P. Unidad <SortIcon col="precio" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <button
                      onClick={() => toggleSort("precioMayor")}
                      className="flex items-center hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    >
                      P. Mayor <SortIcon col="precioMayor" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Estado
                  </TableHead>
                  <TableHead className="pr-6 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <TableCell className="pl-6 py-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex-shrink-0 shadow-sm">
                        {p.img ? (
                          <img
                            src={p.img}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={16} className="text-slate-300" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 max-w-[220px]">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900 dark:text-white text-sm truncate">
                          {p.name}
                        </span>
                        <div className="flex gap-1.5 flex-wrap">
                          {p.badge && (
                            <span
                              className={`text-[9px] uppercase tracking-tighter font-black px-2 py-0.5 rounded-md border ${BADGE_STYLES[p.badge] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}
                            >
                              {p.badge}
                            </span>
                          )}
                          {p.biodegradable && (
                            <span className="flex items-center gap-1 text-[9px] font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                              <Droplet size={8} /> Bio
                            </span>
                          )}
                          {p.concentrado && (
                            <span className="flex items-center gap-1 text-[9px] font-bold bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                              <Zap size={8} /> Conc.
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {getName(p, categories, "category", "categoryId")}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                          {getName(p, lineas, "linea", "lineaId")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        S/ {Number(p.precio).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="font-black text-[#00AEEF] text-sm">
                        S/ {Number(p.precioMayor).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border ${p.active ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${p.active ? "bg-emerald-500" : "bg-slate-400"}`}
                        />
                        {p.active ? "Activo" : "Inactivo"}
                      </span>
                    </TableCell>
                    <TableCell className="pr-6 py-3">
                      <div className="flex justify-end items-center gap-0.5">
                        <button
                          onClick={() => setViewProduct(p)}
                          title="Ver"
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#00AEEF] hover:bg-[#00AEEF]/10 transition-all"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          title="Editar"
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          title="Eliminar"
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          // ── GRID VIEW ──
          <div className="p-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="group bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-700">
                  {p.img ? (
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={24} className="text-slate-300" />
                    </div>
                  )}
                  {p.badge && (
                    <span
                      className={`absolute top-2 left-2 text-[8px] uppercase tracking-wider font-black px-2 py-1 rounded-lg border ${BADGE_STYLES[p.badge] ?? ""}`}
                    >
                      {p.badge}
                    </span>
                  )}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setViewProduct(p)}
                      className="w-7 h-7 rounded-lg bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-[#00AEEF] shadow-sm hover:scale-110 transition-transform"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      className="w-7 h-7 rounded-lg bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-amber-500 shadow-sm hover:scale-110 transition-transform"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="w-7 h-7 rounded-lg bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-rose-500 shadow-sm hover:scale-110 transition-transform"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="p-3.5 space-y-2">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 truncate">
                    {p.category?.name ?? "—"}
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate">
                    {p.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 dark:text-white text-base">
                      S/ {Number(p.precio).toFixed(2)}
                    </span>
                    <span className="font-bold text-[#00AEEF] text-xs">
                      Mayor: S/ {Number(p.precioMayor).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {p.biodegradable && (
                      <span className="text-[8px] font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <Droplet size={7} />
                        Bio
                      </span>
                    )}
                    {p.concentrado && (
                      <span className="text-[8px] font-bold bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <Zap size={7} />
                        Conc.
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && processed.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">
                Filas por página:
              </span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="appearance-none pl-2.5 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:border-[#00AEEF]"
                >
                  {PAGE_SIZES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown
                  size={11}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
              <span className="text-xs text-slate-400">
                {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, processed.length)} de{" "}
                {processed.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pg =
                  totalPages <= 5
                    ? i + 1
                    : page <= 3
                      ? i + 1
                      : page >= totalPages - 2
                        ? totalPages - 4 + i
                        : page - 2 + i;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === pg ? "bg-[#00AEEF] text-white shadow-sm shadow-[#00AEEF]/30" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══ Modal: Ver Producto ══ */}
      <Dialog open={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white dark:bg-slate-900">
          {viewProduct && (
            <>
              <DialogTitle className="sr-only">{viewProduct.name}</DialogTitle>
              <div className="h-56 relative">
                <img
                  src={viewProduct.img}
                  className="w-full h-full object-cover"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                <button
                  onClick={() => setViewProduct(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/60 font-bold mb-1">
                    {getName(viewProduct, categories, "category", "categoryId")}
                  </p>
                  <h2 className="text-2xl font-black text-white leading-tight">
                    {viewProduct.name}
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {viewProduct.desc && (
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {viewProduct.desc}
                  </p>
                )}
                <div className="flex gap-2 flex-wrap">
                  {viewProduct.badge && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border ${BADGE_STYLES[viewProduct.badge] ?? ""}`}
                    >
                      {viewProduct.badge}
                    </span>
                  )}
                  {viewProduct.biodegradable && (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <Droplet size={10} /> Biodegradable
                    </span>
                  )}
                  {viewProduct.concentrado && (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-sky-50 dark:bg-sky-900/20 text-sky-600 px-3 py-1.5 rounded-xl border border-sky-200">
                      <Zap size={10} /> Concentrado
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                      S/ {Number(viewProduct.precio).toFixed(2)}
                    </p>
                    <p className="text-sm text-[#00AEEF] font-bold mt-0.5">
                      Mayor: S/ {Number(viewProduct.precioMayor).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setViewProduct(null);
                      openEdit(viewProduct);
                    }}
                    className="px-5 py-2.5 bg-[#00AEEF] hover:bg-[#0099d4] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-sm shadow-[#00AEEF]/30"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ══ Modal: Formulario ══ */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
              className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              {/* Form header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-5 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-800 rounded-t-3xl">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                  </h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mt-0.5">
                    {editingProduct
                      ? `ID #${editingProduct.id}`
                      : "Completa los campos requeridos"}
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-slate-500" />
                </button>
              </div>

              <div className="px-7 py-6 space-y-5">
                {/* Imagen */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                    Imagen Principal *
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="relative cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#00AEEF]/50 transition-colors overflow-hidden bg-slate-50 dark:bg-slate-800 group min-h-[140px] flex items-center justify-center"
                  >
                    {previewImg ? (
                      <>
                        <img
                          src={previewImg}
                          alt="preview"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-xs font-bold uppercase tracking-widest">
                            Cambiar imagen
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-8">
                        {uploading ? (
                          <Loader2
                            size={24}
                            className="animate-spin text-[#00AEEF]"
                          />
                        ) : (
                          <>
                            <ImagePlus
                              size={24}
                              className="text-slate-300 dark:text-slate-600"
                            />
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                              Clic para subir
                            </p>
                          </>
                        )}
                      </div>
                    )}
                    {uploading && previewImg && (
                      <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center">
                        <Loader2
                          size={20}
                          className="animate-spin text-[#00AEEF]"
                        />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handleImageUpload(e.target.files[0])
                    }
                  />
                </div>

                {/* Nombre + Precios */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Nombre *
                    </label>
                    <Input
                      placeholder="Ej. Limpiador Multiusos"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="rounded-xl h-11 border-slate-200 dark:border-slate-700 focus:border-[#00AEEF] focus-visible:ring-0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Precio Unidad S/ *
                    </label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={form.precio}
                      onChange={(e) => {
                        const v = e.target.value.replace(",", ".");
                        if (/^\d*\.?\d*$/.test(v))
                          setForm((f) => ({ ...f, precio: v }));
                      }}
                      className="rounded-xl h-11 font-bold border-slate-200 dark:border-slate-700 focus:border-[#00AEEF] focus-visible:ring-0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Precio Mayor S/ *
                    </label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={form.precioMayor}
                      onChange={(e) => {
                        const v = e.target.value.replace(",", ".");
                        if (/^\d*\.?\d*$/.test(v))
                          setForm((f) => ({ ...f, precioMayor: v }));
                      }}
                      className="rounded-xl h-11 font-bold border-slate-200 dark:border-slate-700 focus:border-[#00AEEF] focus-visible:ring-0"
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Descripción
                  </label>
                  <Textarea
                    placeholder="Describe las características del producto..."
                    value={form.desc}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, desc: e.target.value }))
                    }
                    rows={3}
                    className="rounded-xl resize-none border-slate-200 dark:border-slate-700 focus:border-[#00AEEF] focus-visible:ring-0"
                  />
                </div>

                {/* Badge */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Badge{" "}
                    <span className="normal-case font-normal text-slate-300">
                      (opcional)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "", label: "Sin badge" },
                      { value: "Más vendido", label: "🔥 Más vendido" },
                      { value: "Nuevo", label: "✨ Nuevo" },
                      { value: "Oferta", label: "💰 Oferta" },
                      { value: "Premium", label: "⭐ Premium" },
                      { value: "Agotado", label: "❌ Agotado" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, badge: value }))}
                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                          form.badge === value
                            ? "border-[#00AEEF] bg-[#00AEEF]/10 text-[#00AEEF] shadow-sm"
                            : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 bg-slate-50 dark:bg-slate-800"
                        }`}
                      >
                        {form.badge === value && (
                          <Check size={10} className="inline mr-1" />
                        )}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selects */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <SelectField
                    label="Categoría *"
                    value={form.categoryId}
                    onChange={(v: string) =>
                      setForm((f) => ({ ...f, categoryId: v }))
                    }
                    options={categories}
                    placeholder="Elegir"
                  />
                  <SelectField
                    label="Línea *"
                    value={form.lineaId}
                    onChange={(v: string) =>
                      setForm((f) => ({ ...f, lineaId: v }))
                    }
                    options={lineas}
                    placeholder="Elegir"
                  />
                  <SelectField
                    label="Aroma"
                    value={form.aromaId}
                    onChange={(v: string) =>
                      setForm((f) => ({ ...f, aromaId: v }))
                    }
                    options={aromas}
                    placeholder="Ninguno"
                  />
                  <SelectField
                    label="Formato"
                    value={form.formatoId}
                    onChange={(v: string) =>
                      setForm((f) => ({ ...f, formatoId: v }))
                    }
                    options={formatos}
                    placeholder="Ninguno"
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      key: "biodegradable",
                      label: "Biodegradable",
                      icon: Droplet,
                      on: "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600",
                    },
                    {
                      key: "concentrado",
                      label: "Concentrado",
                      icon: Zap,
                      on: "border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-600",
                    },
                  ].map(({ key, label, icon: Icon, on }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, [key]: !(f as any)[key] }))
                      }
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                        (form as any)[key]
                          ? `${on} shadow-sm`
                          : "border-slate-200 dark:border-slate-700 text-slate-400 bg-slate-50 dark:bg-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <Icon size={13} />
                      {(form as any)[key] && <Check size={11} />}
                      {label}
                    </button>
                  ))}
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2 pb-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    onClick={handleSave}
                    disabled={
                      saving ||
                      uploading ||
                      !form.name ||
                      !form.precio ||
                      !form.img
                    }
                    className="flex-1 bg-[#00AEEF] hover:bg-[#0099d4] text-white rounded-xl h-12 gap-2 text-[10px] font-bold uppercase tracking-widest shadow-sm shadow-[#00AEEF]/30 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />{" "}
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Check size={14} />{" "}
                        {editingProduct
                          ? "Guardar cambios"
                          : "Registrar producto"}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl h-12 px-6 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
