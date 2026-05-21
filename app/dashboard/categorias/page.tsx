"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Search,
  Folder,
  FileText,
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
  const [globalFilter, setGlobalFilter] = useState("");
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

  // Filtro global estilo PrimeFaces DataTable
  const filteredCategories = categories
    .filter((cat) => {
      const search = globalFilter.toLowerCase();
      return (
        cat.name.toLowerCase().includes(search) ||
        (cat.description && cat.description.toLowerCase().includes(search)) ||
        cat.id.toString().includes(search)
      );
    })
    .sort((a, b) => a.id - b.id);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-background min-h-screen text-foreground antialiased">
      {/* Top Header Simplificado y Profesional */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            Gestión de Categorías
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Administra y organiza las secciones de tu inventario.
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-foreground text-background hover:bg-foreground/90 font-medium"
        >
          <Plus size={16} /> Nueva Categoría
        </Button>
      </div>

      {/* Contenedor Principal Tabla estilo PrimeFaces (Lara/Aura) */}
      <Card className="border border-border/80 shadow-sm rounded-lg overflow-hidden bg-card">
        {/* Header Interno de la Tabla (Filtros Globales) */}
        <div className="p-4 bg-muted/20 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="font-medium text-sm text-muted-foreground">
            Total:{" "}
            <span className="text-foreground font-semibold">
              {filteredCategories.length}
            </span>{" "}
            registros
          </div>
          <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Buscar..."
              className="pl-9 h-9 rounded-md border-border bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40 border-b border-border">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-11 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider w-24">
                    ID
                  </TableHead>
                  <TableHead className="h-11 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Nombre
                  </TableHead>
                  <TableHead className="h-11 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Descripción
                  </TableHead>
                  <TableHead className="h-11 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-right w-32">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span>Cargando datos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-32 text-center text-sm text-muted-foreground"
                    >
                      No se encontraron categorías disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((cat, index) => (
                    <TableRow
                      key={cat.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        #{String(cat.id).padStart(3, "0")}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium text-foreground">
                        {cat.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-muted-foreground max-w-md truncate">
                        {cat.description || (
                          <span className="text-muted-foreground/40 italic text-xs">
                            Sin descripción
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openModal(cat)}
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(cat.id)}
                            disabled={deletingId === cat.id}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            title="Eliminar"
                          >
                            {deletingId === cat.id ? (
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
          </div>
        </CardContent>
      </Card>

      {/* Modal Rediseñado: Limpio, Compacto y Elegante */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[420px] rounded-lg border-border bg-card p-0 overflow-hidden shadow-lg">
          <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
            <DialogTitle className="text-lg font-semibold text-foreground">
              {editingCategory ? "Modificar Categoría" : "Nueva Categoría"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Completa los campos requeridos para gestionar el registro.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Folder size={14} className="text-primary/70" /> Nombre oficial
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Limpieza Industrial"
                className="h-10 rounded-md border-border bg-background px-3 text-sm focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <FileText size={14} className="text-primary/70" /> Descripción
              </label>
              <Input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Detalle opcional sobre la categoría..."
                className="h-10 rounded-md border-border bg-background px-3 text-sm focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          <DialogFooter className="p-4 bg-muted/10 border-t border-border/60 flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              className="h-9 rounded-md border-border font-medium text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="h-9 ml-2 bg-foreground text-background hover:bg-foreground/90 font-medium"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
