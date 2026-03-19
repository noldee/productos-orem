"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Tag,
  AlignLeft,
  Layers,
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
    <div className="w-full space-y-8 p-4 md:p-10 bg-background min-h-screen font-sans selection:bg-primary/30">
      {/* Header Estilo Premium M&G */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-card p-8 md:p-10 rounded-[40px] border border-border shadow-2xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] -mr-10 -mt-10" />

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-[28px] bg-gradient-to-br from-primary to-[#008cc0] flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <Layers size={32} className="text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                Gestión de Inventario
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Categorías
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1">
              Organiza tus productos en{" "}
              <span className="text-foreground">{categories.length}</span>{" "}
              secciones
            </p>
          </div>
        </div>

        <Button
          onClick={() => openModal()}
          className="w-full sm:w-auto bg-primary hover:bg-[#008cc0] text-primary-foreground rounded-2xl h-14 px-8 gap-3 transition-all active:scale-95 shadow-xl shadow-primary/10 shrink-0 font-bold"
        >
          <Plus size={20} /> Nueva Categoría
        </Button>
      </div>

      {/* Tabla con Estilo Dark Card */}
      <Card className="border border-border shadow-2xl rounded-[40px] overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="relative w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[800px] w-full">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="py-6 pl-10 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] w-24">
                      ID
                    </TableHead>
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em]">
                      Nombre de Categoría
                    </TableHead>
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em]">
                      Descripción Detallada
                    </TableHead>
                    <TableHead className="text-right pr-10 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] w-40">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-32 text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : categories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-20 text-center text-muted-foreground italic"
                      >
                        No hay categorías disponibles en este momento.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((cat, i) => (
                      <TableRow
                        key={cat.id}
                        className="group border-border/40 hover:bg-primary/[0.03] transition-colors"
                      >
                        <TableCell className="py-6 pl-10 font-mono text-muted-foreground text-xs">
                          #{String(i + 1).padStart(2, "0")}
                        </TableCell>
                        <TableCell className="font-bold text-foreground">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-border group-hover:bg-primary group-hover:scale-125 transition-all" />
                            {cat.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <span className="line-clamp-1 italic text-sm opacity-70">
                            {cat.description || "Sin descripción asignada"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-10">
                          <div className="flex justify-end gap-3 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openModal(cat)}
                              className="h-10 w-10 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                            >
                              <Pencil size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(cat.id)}
                              disabled={deletingId === cat.id}
                              className="h-10 w-10 rounded-xl bg-secondary text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
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

      {/* Modal Re-diseñado con tu Paleta Dark */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[480px] rounded-[40px] border-border bg-card p-0 overflow-hidden ">
          <div className="bg-gradient-to-r from-primary to-[#008cc0] p-10 text-primary-foreground relative">
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <Layers size={60} />
            </div>
            <DialogTitle className="text-3xl font-bold relative z-10">
              {editingCategory ? "Editar" : "Crear"}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80 mt-2 font-medium relative z-10">
              Configura los detalles de la categoría.
            </DialogDescription>
          </div>

          <div className="p-10 space-y-8 bg-card">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                <Tag size={12} /> Nombre oficial
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Limpieza Industrial"
                className="h-14 rounded-2xl bg-background border-border focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                <AlignLeft size={12} /> Breve descripción
              </label>
              <Input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Opcional..."
                className="h-14 rounded-2xl bg-background border-border focus:ring-primary focus:border-primary text-foreground"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 h-14 rounded-2xl border-border bg-transparent font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
              >
                Cerrar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-[#008cc0] transition-all shadow-lg shadow-primary/20"
              >
                {saving ? <Loader2 className="animate-spin" /> : "Confirmar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
