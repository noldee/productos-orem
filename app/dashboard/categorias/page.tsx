"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  Loader2,
  Tag,
  Hash,
  AlignLeft,
  MoreHorizontal,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Category {
  id: number;
  name: string;
  description: string | null;
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setDesc(category.description ?? "");
    } else {
      setEditingCategory(null);
      setName("");
      setDesc("");
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const payload = { name, description: desc || null };
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, payload);
      } else {
        await api.post("/categories", payload);
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-8 p-4 md:p-10 bg-white min-h-screen">
      {/* Header Estilo Premium */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-stone-50 p-6 md:p-8 rounded-[32px] border border-stone-100">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[22px] bg-stone-900 flex items-center justify-center shadow-xl shadow-stone-200">
            <Tag size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900">
              Categorías
            </h1>
            <p className="text-stone-500 font-medium">
              Organiza tus productos ({categories.length})
            </p>
          </div>
        </div>
        <Button
          onClick={() => openModal()}
          className="w-full md:w-auto bg-stone-900 hover:bg-stone-800 text-white rounded-2xl h-14 px-8 gap-3 transition-all active:scale-95"
        >
          <Plus size={20} /> Nueva Categoría
        </Button>
      </div>

      {/* Contenedor de Tabla / Cards */}
      <Card className="border-none shadow-2xl shadow-stone-100 rounded-[32px] overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-stone-200" />
            </div>
          ) : categories.length === 0 ? (
            <div className="py-20 text-center text-stone-400 font-medium">
              No hay categorías disponibles.
            </div>
          ) : (
            <>
              {/* VISTA DESKTOP (Tabla) */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-stone-50/50">
                    <TableRow className="border-stone-100">
                      <TableHead className="py-6 pl-8 text-stone-400 font-bold uppercase text-[10px] tracking-widest w-20">
                        ID
                      </TableHead>
                      <TableHead className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">
                        Nombre de Categoría
                      </TableHead>
                      <TableHead className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">
                        Descripción
                      </TableHead>
                      <TableHead className="text-right pr-8 text-stone-400 font-bold uppercase text-[10px] tracking-widest">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((cat) => (
                      <TableRow
                        key={cat.id}
                        className="group border-stone-50 hover:bg-stone-50/30 transition-colors"
                      >
                        <TableCell className="py-5 pl-8 font-mono text-stone-400 text-sm">
                          #{cat.id}
                        </TableCell>
                        <TableCell className="font-bold text-stone-900">
                          {cat.name}
                        </TableCell>
                        <TableCell className="text-stone-500 max-w-xs truncate">
                          {cat.description || "—"}
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openModal(cat)}
                              className="h-10 w-10 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                            >
                              <Pencil size={17} />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => remove(cat.id)}
                              disabled={deletingId === cat.id}
                              className="h-10 w-10 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50"
                            >
                              {deletingId === cat.id ? (
                                <Loader2 size={17} className="animate-spin" />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* VISTA MÓVIL (Cards) */}
              <div className="md:hidden grid grid-cols-1 divide-y divide-stone-100">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-6 space-y-3 active:bg-stone-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                          Nombre
                        </span>
                        <h3 className="font-bold text-stone-900 text-lg">
                          {cat.name}
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-stone-300">
                        #{cat.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        Descripción
                      </span>
                      <p className="text-sm text-stone-600 line-clamp-2">
                        {cat.description || "Sin descripción"}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => openModal(cat)}
                        className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl h-11 gap-2 border-none shadow-none"
                      >
                        <Pencil size={16} /> Editar
                      </Button>
                      <Button
                        onClick={() => remove(cat.id)}
                        disabled={deletingId === cat.id}
                        className="w-14 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl h-11 border-none shadow-none"
                      >
                        {deletingId === cat.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* MODAL DE EDICIÓN/CREACIÓN */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[450px] rounded-[32px] border-none p-0 overflow-hidden">
          <div className="bg-stone-900 p-8 text-white">
            <DialogTitle className="text-2xl font-bold">
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
            <DialogDescription className="text-stone-400 mt-1">
              {editingCategory
                ? "Modifica los detalles de la categoría."
                : "Crea una nueva clasificación para tus productos."}
            </DialogDescription>
          </div>

          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <Tag size={12} /> Nombre de Categoría
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Detergentes"
                className="h-12 rounded-xl border-stone-200 focus:ring-stone-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <AlignLeft size={12} /> Descripción (Opcional)
              </label>
              <Input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Breve descripción..."
                className="h-12 rounded-xl border-stone-200 focus:ring-stone-900"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 h-12 rounded-xl border-stone-200 font-bold"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1 h-12 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800"
              >
                {saving ? <Loader2 className="animate-spin" /> : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
