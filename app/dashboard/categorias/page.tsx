"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Pencil, Trash2, Plus, Loader2, Tag, AlignLeft } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
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
      <div className="flex flex-col sm:row justify-between items-start sm:items-center gap-6 bg-stone-50 p-6 md:p-8 rounded-[32px] border border-stone-100">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-[22px] bg-stone-900 flex items-center justify-center shadow-xl shadow-stone-200 shrink-0">
            <Tag size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900">
              Categorías
            </h1>
            <p className="text-stone-500 font-medium text-sm md:text-base">
              Gestión de catálogo ({categories.length})
            </p>
          </div>
        </div>
        <Button
          onClick={() => openModal()}
          className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white rounded-2xl h-14 px-8 gap-3 transition-all active:scale-95 shrink-0"
        >
          <Plus size={20} /> Nueva Categoría
        </Button>
      </div>

      {/* Tabla con Scroll Horizontal Shadcn Style */}
      <Card className="border border-stone-100 shadow-2xl shadow-stone-100/50 rounded-[32px] overflow-hidden bg-white">
        <CardContent className="p-0">
          {/* CONTENEDOR DE SCROLL: Esto es lo que permite el scroll como en tu imagen */}
          <div className="relative w-full overflow-x-auto scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
            <div className="min-w-[700px] w-full">
              <Table>
                <TableHeader className="bg-stone-50/50">
                  <TableRow className="border-stone-100 hover:bg-transparent">
                    <TableHead className="py-6 pl-8 text-stone-400 font-bold uppercase text-[10px] tracking-widest w-20">
                      #
                    </TableHead>
                    <TableHead className="text-stone-400 font-bold uppercase text-[10px] tracking-widest min-w-[200px]">
                      Nombre de Categoría
                    </TableHead>
                    <TableHead className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">
                      Descripción
                    </TableHead>
                    <TableHead className="text-right pr-8 text-stone-400 font-bold uppercase text-[10px] tracking-widest w-32">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-32 text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-stone-300 mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : categories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-20 text-center text-stone-400 font-medium"
                      >
                        No hay categorías disponibles.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((cat, i) => (
                      <TableRow
                        key={cat.id}
                        className="group border-stone-50 hover:bg-stone-50/40 transition-colors"
                      >
                        <TableCell className="py-5 pl-8 font-mono text-stone-400 text-sm">
                          {String(i + 1).padStart(2, "0")}
                        </TableCell>
                        <TableCell className="font-bold text-stone-900">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-stone-200 group-hover:bg-stone-900 transition-colors" />
                            {cat.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-stone-500">
                          <span className="line-clamp-1 italic text-sm">
                            {cat.description || "Sin descripción disponible"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openModal(cat)}
                              className="h-9 w-9 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                            >
                              <Pencil size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(cat.id)}
                              disabled={deletingId === cat.id}
                              className="h-9 w-9 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50"
                            >
                              {deletingId === cat.id ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Re-diseñado */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[450px] rounded-[32px] border-none p-0 overflow-hidden shadow-2xl">
          <div className="bg-stone-900 p-8 text-white">
            <DialogTitle className="text-2xl font-bold">
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
            <DialogDescription className="text-stone-400 mt-1">
              Completa los campos para organizar tu catálogo.
            </DialogDescription>
          </div>

          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <Tag size={12} /> Nombre de Categoría
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Detergentes Industriales"
                className="h-12 rounded-xl border-stone-200 focus:ring-stone-900 focus:border-stone-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <AlignLeft size={12} /> Descripción
              </label>
              <Input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Opcional..."
                className="h-12 rounded-xl border-stone-200 focus:ring-stone-900 focus:border-stone-900"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 h-12 rounded-xl border-stone-200 font-bold text-stone-600 hover:bg-stone-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1 h-12 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
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
