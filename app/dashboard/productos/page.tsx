"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import {
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  Loader2,
  ShoppingBag,
  ImagePlus,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  Eye,
  EyeOff,
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
  category: SelectOption;
  linea: SelectOption;
  aroma: SelectOption;
  formato: SelectOption;
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
  const [form, setForm] = useState(emptyForm);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
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
      setProducts(p.data);
      setCategories(c.data);
      setLineas(l.data);
      setAromas(a.data);
      setFormatos(f.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setPreviewImg("");
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      desc: p.desc,
      precio: String(p.precio),
      img: p.img,
      badge: p.badge ?? "",
      biodegradable: p.biodegradable,
      concentrado: p.concentrado,
      categoryId: String(p.category.id),
      lineaId: String(p.linea.id),
      aromaId: String(p.aroma.id),
      formatoId: String(p.formato.id),
    });
    setPreviewImg(p.img);
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
    if (
      !form.name ||
      !form.precio ||
      !form.img ||
      !form.categoryId ||
      !form.lineaId ||
      !form.aromaId ||
      !form.formatoId
    )
      return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        desc: form.desc,
        precio: Number(form.precio),
        img: form.img,
        badge: form.badge || undefined,
        biodegradable: form.biodegradable,
        concentrado: form.concentrado,
        categoryId: Number(form.categoryId),
        lineaId: Number(form.lineaId),
        aromaId: Number(form.aromaId),
        formatoId: Number(form.formatoId),
      };
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setShowForm(false);
      fetchAll();
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (p: Product) => {
    await api.put(`/products/${p.id}`, { active: !p.active });
    fetchAll();
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    setDeletingId(p.id);
    try {
      if (p.img) await api.delete("/storage/delete", { data: { url: p.img } });
      await api.delete(`/products/${p.id}`);
      fetchAll();
    } finally {
      setDeletingId(null);
    }
  };

  const SelectField = ({
    label,
    value,
    onChange,
    options,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: SelectOption[];
    placeholder: string;
  }) => (
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
          {options.map((o) => (
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
    <div className="w-full space-y-8 p-4 md:p-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-stone-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center">
            <ShoppingBag size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Productos
            </h1>
            <p className="text-sm text-stone-400 mt-0.5">
              {products.length}{" "}
              {products.length === 1
                ? "producto registrado"
                : "productos registrados"}
            </p>
          </div>
        </div>
        <Button
          onClick={openCreate}
          className="bg-stone-900 hover:bg-stone-700 text-white rounded-full px-6 gap-2 shadow-sm"
        >
          <Plus size={15} /> Nuevo producto
        </Button>
      </div>

      {/* Modal / Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-stone-100">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5 uppercase tracking-widest">
                    {editingProduct
                      ? `ID #${editingProduct.id}`
                      : "Completa todos los campos requeridos"}
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-stone-600" />
                </button>
              </div>

              <div className="px-8 py-6 space-y-6">
                {/* Imagen */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Imagen del Producto *
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="relative group cursor-pointer rounded-2xl border-2 border-dashed border-stone-200 hover:border-stone-400 transition-colors overflow-hidden bg-stone-50"
                    style={{ minHeight: 160 }}
                  >
                    {previewImg ? (
                      <div className="relative">
                        <img
                          src={previewImg}
                          alt="preview"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-xs font-bold uppercase tracking-widest">
                            Cambiar imagen
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 gap-3">
                        {uploading ? (
                          <Loader2
                            size={28}
                            className="animate-spin text-stone-400"
                          />
                        ) : (
                          <>
                            <ImagePlus size={28} className="text-stone-300" />
                            <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">
                              Haz clic para subir
                            </p>
                          </>
                        )}
                      </div>
                    )}
                    {uploading && previewImg && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <Loader2
                          size={24}
                          className="animate-spin text-stone-600"
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

                {/* Nombre y Precio */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Nombre *
                    </label>
                    <Input
                      placeholder="Nombre del producto"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="rounded-xl border-stone-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Precio *
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={form.precio}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, precio: e.target.value }))
                      }
                      className="rounded-xl border-stone-200"
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Descripción
                  </label>
                  <textarea
                    placeholder="Descripción del producto..."
                    value={form.desc}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, desc: e.target.value }))
                    }
                    rows={3}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-stone-400 resize-none"
                  />
                </div>

                {/* Badge */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Badge <span className="text-stone-300">(opcional)</span>
                  </label>
                  <Input
                    placeholder='Ej: "Nuevo", "Oferta"'
                    value={form.badge}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, badge: e.target.value }))
                    }
                    className="rounded-xl border-stone-200"
                  />
                </div>

                {/* Selects */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SelectField
                    label="Categoría *"
                    value={form.categoryId}
                    onChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
                    options={categories}
                    placeholder="Selecciona"
                  />
                  <SelectField
                    label="Línea *"
                    value={form.lineaId}
                    onChange={(v) => setForm((f) => ({ ...f, lineaId: v }))}
                    options={lineas}
                    placeholder="Selecciona"
                  />
                  <SelectField
                    label="Aroma *"
                    value={form.aromaId}
                    onChange={(v) => setForm((f) => ({ ...f, aromaId: v }))}
                    options={aromas}
                    placeholder="Selecciona"
                  />
                  <SelectField
                    label="Formato *"
                    value={form.formatoId}
                    onChange={(v) => setForm((f) => ({ ...f, formatoId: v }))}
                    options={formatos}
                    placeholder="Selecciona"
                  />
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                  {[
                    { key: "biodegradable", label: "Biodegradable" },
                    { key: "concentrado", label: "Concentrado" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          [key]: !f[key as keyof typeof f],
                        }))
                      }
                      className="flex items-center gap-2.5 group"
                    >
                      <div
                        className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${form[key as keyof typeof form] ? "bg-stone-900" : "bg-stone-200"}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${form[key as keyof typeof form] ? "translate-x-5" : "translate-x-0"}`}
                        />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-stone-100">
                  <Button
                    onClick={handleSave}
                    disabled={saving || uploading}
                    className="flex-1 bg-stone-900 hover:bg-stone-700 text-white rounded-xl h-11 gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />{" "}
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Check size={15} />{" "}
                        {editingProduct ? "Guardar cambios" : "Crear producto"}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl h-11 px-6 border-stone-200"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabla */}
      <Card className="border border-stone-100 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-7 w-7 animate-spin text-stone-300" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50 hover:bg-stone-50">
                  <TableHead className="pl-6 w-16 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Img
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Nombre
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hidden md:table-cell">
                    Categoría
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hidden lg:table-cell">
                    Línea
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hidden lg:table-cell">
                    Formato
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Precio
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hidden md:table-cell">
                    Estado
                  </TableHead>
                  <TableHead className="text-right pr-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-32 text-center text-stone-400 text-sm italic"
                    >
                      No hay productos registrados aún.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((p) => (
                    <TableRow
                      key={p.id}
                      className={`group border-stone-50 transition-colors ${p.active ? "hover:bg-stone-50/60" : "opacity-50 hover:bg-stone-50/40"}`}
                    >
                      {/* Imagen */}
                      <TableCell className="pl-6">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100">
                          {p.img ? (
                            <img
                              src={p.img}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag
                                size={16}
                                className="text-stone-300"
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Nombre + badge */}
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-stone-800 text-sm">
                            {p.name}
                          </span>
                          <div className="flex gap-1.5 flex-wrap">
                            {p.badge && (
                              <span className="text-[9px] uppercase tracking-widest font-bold bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                                {p.badge}
                              </span>
                            )}
                            {p.biodegradable && (
                              <span className="text-[9px] uppercase tracking-widest font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                                Bio
                              </span>
                            )}
                            {p.concentrado && (
                              <span className="text-[9px] uppercase tracking-widest font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                Conc.
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell text-stone-500 text-sm">
                        {p.category.name}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-stone-500 text-sm">
                        {p.linea.name}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-stone-500 text-sm">
                        {p.formato.name}
                      </TableCell>

                      {/* Precio */}
                      <TableCell>
                        <span className="font-bold text-stone-900 text-sm">
                          S/ {Number(p.precio).toFixed(2)}
                        </span>
                      </TableCell>

                      {/* Estado */}
                      <TableCell className="hidden md:table-cell">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full transition-colors ${
                            p.active
                              ? "bg-green-50 text-green-600 hover:bg-green-100"
                              : "bg-stone-100 text-stone-400 hover:bg-stone-200"
                          }`}
                        >
                          {p.active ? "Activo" : "Inactivo"}
                        </button>
                      </TableCell>

                      {/* Acciones */}
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(p)}
                            className="h-8 w-8 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(p)}
                            className={`h-8 w-8 rounded-lg ${p.active ? "text-stone-400 hover:text-amber-600 hover:bg-amber-50" : "text-stone-400 hover:text-green-600 hover:bg-green-50"}`}
                          >
                            {p.active ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(p)}
                            disabled={deletingId === p.id}
                            className="h-8 w-8 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                          >
                            {deletingId === p.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
