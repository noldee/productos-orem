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
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
// IMPORTANTE: Agregamos DialogTitle y DialogDescription
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// --- Interfaces ---
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
  const [previewImg, setPreviewImg] = useState<string>("");

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

      const rawProducts = Array.isArray(p.data) ? p.data : p.data?.data || [];

      setProducts(rawProducts);
      setCategories(c.data || []);
      setLineas(l.data || []);
      setAromas(a.data || []);
      setFormatos(f.data || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getRelationName = (
    item: any,
    list: SelectOption[],
    relationKey: string,
    idKey: string,
  ) => {
    if (item[relationKey]?.name) return item[relationKey].name;
    const id = item[idKey] || item[relationKey];
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
      name: p.name || "",
      desc: p.desc || "",
      precio: String(p.precio || ""),
      img: p.img || "",
      badge: p.badge ?? "",
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
    } catch (e) {
      console.error(e);
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
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        lineaId: form.lineaId ? Number(form.lineaId) : null,
        aromaId: form.aromaId ? Number(form.aromaId) : null,
        formatoId: form.formatoId ? Number(form.formatoId) : null,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setShowForm(false);
      fetchAll();
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    try {
      await api.delete(`/products/${p.id}`);
      fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  const SelectField = ({
    label,
    value,
    onChange,
    options,
    placeholder,
  }: any) => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-stone-400 pr-8"
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
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
        />
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-8 p-4 md:p-10 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-stone-50 p-6 md:p-8 rounded-[32px] border border-stone-100">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[22px] bg-stone-900 flex items-center justify-center shadow-2xl shadow-stone-200">
            <ShoppingBag size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900">
              Productos
            </h1>
            <p className="text-stone-500 font-medium">
              {products.length} artículos registrados
            </p>
          </div>
        </div>
        <Button
          onClick={openCreate}
          className="w-full md:w-auto bg-stone-900 hover:bg-stone-800 text-white rounded-2xl h-14 px-8 gap-3"
        >
          <Plus size={20} /> Nuevo producto
        </Button>
      </div>

      {/* Tabla */}
      <Card className="border-none shadow-2xl shadow-stone-100 rounded-[32px] overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-stone-200" />
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-stone-400 font-medium">
              No se encontraron productos.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-stone-50/50">
                  <TableRow className="border-stone-100">
                    <TableHead className="py-6 pl-8 text-stone-400 font-bold uppercase text-[10px] tracking-widest">
                      Producto
                    </TableHead>
                    <TableHead className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">
                      Categoría
                    </TableHead>
                    <TableHead className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">
                      Precio
                    </TableHead>
                    <TableHead className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">
                      Estado
                    </TableHead>
                    <TableHead className="text-right pr-8 text-stone-400 font-bold uppercase text-[10px] tracking-widest">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow
                      key={p.id}
                      className="group border-stone-50 hover:bg-stone-50/30 transition-colors"
                    >
                      <TableCell className="py-5 pl-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                            {p.img ? (
                              <img
                                src={p.img}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-300">
                                <ShoppingBag size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-stone-900 text-base">
                              {p.name}
                            </span>
                            <div className="flex gap-1">
                              {p.biodegradable && (
                                <Badge className="bg-green-50 text-green-600 border-none text-[8px] px-1.5 py-0">
                                  BIO
                                </Badge>
                              )}
                              {p.concentrado && (
                                <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] px-1.5 py-0">
                                  CONC
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-stone-700">
                            {getRelationName(
                              p,
                              categories,
                              "category",
                              "categoryId",
                            )}
                          </span>
                          <span className="text-[11px] text-stone-400 font-medium uppercase">
                            {getRelationName(p, lineas, "linea", "lineaId")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-black text-stone-900">
                          S/ {Number(p.precio || 0).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase ${p.active ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-400"}`}
                        >
                          {p.active ? "Activo" : "Inactivo"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setViewProduct(p)}
                            className="h-10 w-10 rounded-xl text-stone-400 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Eye size={17} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEdit(p)}
                            className="h-10 w-10 rounded-xl text-stone-400 hover:text-amber-600 hover:bg-amber-50"
                          >
                            <Pencil size={17} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(p)}
                            className="h-10 w-10 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={17} />
                          </Button>
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

      {/* --- MODAL DE VISTA (CORREGIDO) --- */}
      <Dialog open={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[32px] border-none">
          {viewProduct && (
            <div>
              {/* ACCESIBILIDAD: Título y Descripción ocultos visualmente */}
              <DialogTitle className="sr-only">
                Detalles de {viewProduct.name}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Vista detallada con información de precio, línea y
                características.
              </DialogDescription>

              <div className="relative h-64 bg-stone-100">
                <img
                  src={viewProduct.img}
                  alt={viewProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 mb-2">
                    {getRelationName(
                      viewProduct,
                      categories,
                      "category",
                      "categoryId",
                    )}
                  </Badge>
                  <h2 className="text-2xl font-bold">{viewProduct.name}</h2>
                </div>
              </div>
              <div className="p-8 space-y-6 bg-white text-stone-900">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                      Precio
                    </p>
                    <p className="text-4xl font-black">
                      S/ {Number(viewProduct.precio).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                      Línea
                    </p>
                    <p className="text-lg font-bold">
                      {getRelationName(viewProduct, lineas, "linea", "lineaId")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-2xl border flex items-center gap-3 ${viewProduct.biodegradable ? "bg-green-50 text-green-700 border-green-100" : "bg-stone-50 text-stone-300 opacity-50"}`}
                  >
                    <Droplet size={20} />
                    <span className="text-[10px] font-bold uppercase">
                      Biodegradable
                    </span>
                  </div>
                  <div
                    className={`p-4 rounded-2xl border flex items-center gap-3 ${viewProduct.concentrado ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-stone-50 text-stone-300 opacity-50"}`}
                  >
                    <Zap size={20} />
                    <span className="text-[10px] font-bold uppercase">
                      Concentrado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- FORMULARIO (MODAL ANIMADO CON FRAMER MOTION) --- */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-3xl my-auto overflow-hidden"
            >
              <div className="px-10 pt-10 pb-6 flex justify-between items-center border-b border-stone-50">
                <h2 className="text-2xl font-bold text-stone-900">
                  {editingProduct ? "Editar" : "Nuevo"} Producto
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative w-full h-48 rounded-[32px] border-2 border-dashed border-stone-200 bg-stone-50 flex items-center justify-center cursor-pointer overflow-hidden hover:border-stone-400 transition-all"
                >
                  {previewImg ? (
                    <img
                      src={previewImg}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-stone-400 flex flex-col items-center gap-2">
                      {uploading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <ImagePlus size={32} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            Subir Imagen del Producto
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleImageUpload(e.target.files[0])
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-stone-400">
                      Nombre
                    </label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="rounded-xl h-12"
                      placeholder="Ej. Limpiador Multiusos"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-stone-400">
                      Precio (S/)
                    </label>
                    <Input
                      type="number"
                      value={form.precio}
                      onChange={(e) =>
                        setForm({ ...form, precio: e.target.value })
                      }
                      className="rounded-xl h-12 font-bold"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SelectField
                    label="Categoría"
                    value={form.categoryId}
                    options={categories}
                    onChange={(v: any) => setForm({ ...form, categoryId: v })}
                    placeholder="Sel. Cat."
                  />
                  <SelectField
                    label="Línea"
                    value={form.lineaId}
                    options={lineas}
                    onChange={(v: any) => setForm({ ...form, lineaId: v })}
                    placeholder="Sel. Línea"
                  />
                  <SelectField
                    label="Aroma"
                    value={form.aromaId}
                    options={aromas}
                    onChange={(v: any) => setForm({ ...form, aromaId: v })}
                    placeholder="Sel. Aroma"
                  />
                  <SelectField
                    label="Formato"
                    value={form.formatoId}
                    options={formatos}
                    onChange={(v: any) => setForm({ ...form, formatoId: v })}
                    placeholder="Sel. Form."
                  />
                </div>

                <div className="flex gap-4 pt-4 pb-4">
                  <Button
                    onClick={handleSave}
                    disabled={saving || uploading}
                    className="flex-1 bg-stone-900 text-white rounded-2xl h-14 text-base font-bold"
                  >
                    {saving ? (
                      <Loader2 className="animate-spin" />
                    ) : editingProduct ? (
                      "Guardar Cambios"
                    ) : (
                      "Publicar Producto"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="px-8 rounded-2xl h-14 border-stone-200 font-bold"
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
