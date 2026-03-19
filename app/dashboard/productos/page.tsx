"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Loader2,
  ShoppingBag,
  ImagePlus,
  ChevronDown,
  Eye,
  Droplet,
  Zap,
  Check,
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

interface SelectOption {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  desc: string;
  precio: number;
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
  img: "",
  badge: "",
  biodegradable: false,
  concentrado: false,
  categoryId: "",
  lineaId: "",
  aromaId: "",
  formatoId: "",
};

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [lineas, setLineas] = useState<SelectOption[]>([]);
  const [aromas, setAromas] = useState<SelectOption[]>([]);
  const [formatos, setFormatos] = useState<SelectOption[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewImg, setPreviewImg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/storage/upload", formData, {
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
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        lineaId: form.lineaId ? Number(form.lineaId) : undefined,
        aromaId: form.aromaId ? Number(form.aromaId) : undefined,
        formatoId: form.formatoId ? Number(form.formatoId) : undefined,
      };
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setShowForm(false);
      fetchAll();
    } catch (e) {
      console.error("Error al guardar:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    await api.delete(`/products/${p.id}`);
    fetchAll();
  };

  // ── SelectField con tokens semánticos ──
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
          className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring pr-8 h-11 transition-colors"
        >
          <option value="">{placeholder}</option>
          {options.map((o: any) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6 p-4 md:p-8 max-w-[1600px] mx-auto overflow-hidden">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <ShoppingBag size={22} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Productos
            </h1>
            <p className="text-sm text-muted-foreground">
              {products.length} artículos en tu catálogo
            </p>
          </div>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary hover:opacity-90 text-primary-foreground rounded-full px-6 h-11 gap-2 text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
        >
          <Plus size={16} /> Nuevo producto
        </Button>
      </div>

      {/* ── Tabla ── */}
      <Card className="border border-border shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-32 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Cargando catálogo...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-8">
              <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-4">
                <ShoppingBag size={28} className="text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground italic mb-4">
                No hay productos registrados aún.
              </p>
              <Button
                onClick={openCreate}
                variant="outline"
                className="rounded-full font-bold uppercase text-[10px] tracking-widest"
              >
                Crear el primero
              </Button>
            </div>
          ) : (
            <div className="w-full overflow-x-auto custom-scrollbar">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
                    <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-20">
                      Img
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Info. Producto
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Categoría / Línea
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-32">
                      Precio
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-28">
                      Estado
                    </TableHead>
                    <TableHead className="pr-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right w-36">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow
                      key={p.id}
                      className="border-border hover:bg-muted/30 transition-colors group"
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border shadow-sm">
                          {p.img ? (
                            <img
                              src={p.img}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag
                                size={16}
                                className="text-muted-foreground/30"
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-foreground text-sm">
                            {p.name}
                          </span>
                          <div className="flex gap-1.5 flex-wrap">
                            {p.badge && (
                              <span className="text-[8px] uppercase tracking-tighter font-black bg-primary text-primary-foreground px-2 py-0.5 rounded-md italic">
                                {p.badge}
                              </span>
                            )}
                            {p.biodegradable && (
                              <span className="flex items-center gap-1 text-[9px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <Droplet size={8} /> Bio
                              </span>
                            )}
                            {p.concentrado && (
                              <span className="flex items-center gap-1 text-[9px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                                <Zap size={8} /> Conc.
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-foreground font-medium">
                            {getName(p, categories, "category", "categoryId")}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            {getName(p, lineas, "linea", "lineaId")}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <span className="font-black text-foreground text-base">
                          S/ {Number(p.precio).toFixed(2)}
                        </span>
                      </TableCell>

                      <TableCell className="py-4">
                        <span
                          className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border ${
                            p.active
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {p.active ? "Activo" : "Inactivo"}
                        </span>
                      </TableCell>

                      <TableCell className="pr-6 py-4">
                        <div className="flex justify-end items-center gap-1">
                          <button
                            onClick={() => setViewProduct(p)}
                            className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => openEdit(p)}
                            className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Modal Ver producto ── */}
      <Dialog open={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-card">
          {viewProduct && (
            <>
              <DialogTitle className="sr-only">{viewProduct.name}</DialogTitle>
              <div className="h-64 relative">
                <img
                  src={viewProduct.img}
                  className="w-full h-full object-cover"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold mb-1">
                    {getName(viewProduct, categories, "category", "categoryId")}
                  </p>
                  <h2 className="text-3xl font-bold text-white leading-tight">
                    {viewProduct.name}
                  </h2>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {viewProduct.desc ||
                    "Este producto es parte de nuestra línea exclusiva de limpieza premium."}
                </p>
                <div className="flex gap-2">
                  {viewProduct.biodegradable && (
                    <span className="flex items-center gap-1.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <Droplet size={10} /> Biodegradable
                    </span>
                  )}
                  {viewProduct.concentrado && (
                    <span className="flex items-center gap-1.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-xl border border-blue-500/20">
                      <Zap size={10} /> Concentrado
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <p className="text-4xl font-black text-foreground">
                    S/ {Number(viewProduct.precio).toFixed(2)}
                  </p>
                  <button
                    onClick={() => {
                      setViewProduct(null);
                      openEdit(viewProduct);
                    }}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
                  >
                    Editar Detalle
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Modal Formulario ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-card rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border custom-scrollbar"
            >
              {/* Header del modal */}
              <div className="flex items-center justify-between px-10 pt-10 pb-6 sticky top-0 bg-card/80 backdrop-blur-md z-10 border-b border-border">
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground">
                    {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                  </h2>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-[0.2em] font-bold">
                    Gestión de inventario M&G
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-10 h-10 rounded-2xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              <div className="px-10 py-6 space-y-8">
                {/* Sección Imagen + datos principales */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-4 space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Imagen Principal
                    </label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="relative aspect-square cursor-pointer rounded-[2rem] border-2 border-dashed border-border hover:border-ring transition-all overflow-hidden bg-muted group"
                    >
                      {previewImg ? (
                        <>
                          <img
                            src={previewImg}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                              Cambiar Foto
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-3">
                          {uploading ? (
                            <Loader2
                              size={24}
                              className="animate-spin text-primary"
                            />
                          ) : (
                            <>
                              <ImagePlus
                                size={32}
                                className="text-muted-foreground/30"
                              />
                              <p className="text-[9px] text-muted-foreground uppercase font-black">
                                Subir archivo
                              </p>
                            </>
                          )}
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

                  {/* Datos principales */}
                  <div className="md:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Nombre del Producto
                        </label>
                        <Input
                          placeholder="Ej. Limpiador Multiusos Lavanda"
                          value={form.name}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                          }
                          className="rounded-xl h-12"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Precio (PEN)
                        </label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={form.precio}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, precio: e.target.value }))
                          }
                          className="rounded-xl h-12 font-bold text-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Descripción Corta
                      </label>
                      <Textarea
                        placeholder="Describe las bondades del producto..."
                        value={form.desc}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, desc: e.target.value }))
                        }
                        rows={3}
                        className="rounded-xl resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <SelectField
                        label="Categoría"
                        value={form.categoryId}
                        onChange={(v: string) =>
                          setForm((f) => ({ ...f, categoryId: v }))
                        }
                        options={categories}
                        placeholder="Seleccionar"
                      />
                      <SelectField
                        label="Línea de Producto"
                        value={form.lineaId}
                        onChange={(v: string) =>
                          setForm((f) => ({ ...f, lineaId: v }))
                        }
                        options={lineas}
                        placeholder="Seleccionar"
                      />
                    </div>
                  </div>
                </div>

                {/* Aroma, Formato y Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end border-t border-border pt-8">
                  <div className="grid grid-cols-2 gap-4">
                    <SelectField
                      label="Aroma (Opcional)"
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
                  <div className="flex gap-3">
                    {[
                      {
                        key: "biodegradable",
                        label: "Biodegradable",
                        color: "bg-emerald-500",
                      },
                      {
                        key: "concentrado",
                        label: "Concentrado",
                        color: "bg-blue-500",
                      },
                    ].map(({ key, label, color }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, [key]: !(f as any)[key] }))
                        }
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                          (form as any)[key]
                            ? `${color} text-white border-transparent shadow-lg`
                            : "border-border text-muted-foreground bg-muted"
                        }`}
                      >
                        {(form as any)[key] && <Check size={12} />} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer del modal */}
                <div className="flex gap-4 pt-4 pb-10">
                  <Button
                    onClick={handleSave}
                    disabled={saving || uploading}
                    className="flex-1 bg-primary hover:opacity-90 text-primary-foreground rounded-2xl h-14 gap-3 text-xs font-bold uppercase tracking-widest"
                  >
                    {saving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Check size={18} />
                    )}
                    {editingProduct
                      ? "Actualizar Producto"
                      : "Registrar en Catálogo"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="rounded-2xl h-14 px-10 font-bold text-muted-foreground uppercase text-[10px] tracking-widest"
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
