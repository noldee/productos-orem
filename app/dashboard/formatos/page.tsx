"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Package,
  Eye,
  Info,
  AlignLeft,
  ChevronRight,
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

interface Formato {
  id: number;
  name: string;
  description: string | null;
}

export default function FormatosPage() {
  const [formatos, setFormatos] = useState<Formato[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingFormato, setEditingFormato] = useState<Formato | null>(null);
  const [viewingFormato, setViewingFormato] = useState<Formato | null>(null);

  // Form states
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchFormatos = async () => {
    try {
      const { data } = await api.get("/formatos");
      setFormatos(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Error fetching formatos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormatos();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setIsSubmitting(true);
    try {
      if (editingFormato) {
        await api.put(`/formatos/${editingFormato.id}`, {
          name: formData.name,
          description: formData.description || null,
        });
      } else {
        await api.post("/formatos", {
          name: formData.name,
          description: formData.description || null,
        });
      }
      setFormData({ name: "", description: "" });
      setIsCreateModalOpen(false);
      setEditingFormato(null);
      fetchFormatos();
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este formato?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/formatos/${id}`);
      fetchFormatos();
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (f: Formato) => {
    setEditingFormato(f);
    setFormData({ name: f.name, description: f.description ?? "" });
    setIsCreateModalOpen(true);
  };

  return (
    <div className="w-full space-y-8 p-4 md:p-10 bg-white min-h-screen">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-stone-50 p-6 md:p-8 rounded-[32px] border border-stone-100">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[22px] bg-stone-900 flex items-center justify-center shadow-xl shadow-stone-200">
            <Package size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900">
              Formatos
            </h1>
            <p className="text-stone-500 font-medium">
              Gestión de presentaciones ({formatos.length})
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingFormato(null);
            setFormData({ name: "", description: "" });
            setIsCreateModalOpen(true);
          }}
          className="w-full md:w-auto bg-stone-900 hover:bg-stone-800 text-white rounded-2xl h-14 px-8 gap-3 transition-all active:scale-95 shadow-lg shadow-stone-200"
        >
          <Plus size={20} /> Nuevo Formato
        </Button>
      </div>

      {/* Contenedor Principal */}
      <Card className="border-none shadow-2xl shadow-stone-100 rounded-[32px] overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-40 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-stone-300" />
              <p className="text-stone-400 font-medium animate-pulse">
                Cargando presentaciones...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-50/50">
                  <TableRow className="hover:bg-transparent border-stone-100">
                    <TableHead className="w-20 pl-8 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      #
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Nombre
                    </TableHead>
                    <TableHead className="hidden md:table-cell text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Descripción
                    </TableHead>
                    <TableHead className="text-right pr-8 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {formatos.map((f, i) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        key={f.id}
                        className="group border-stone-50 hover:bg-stone-50/40 transition-colors"
                      >
                        <TableCell className="pl-8 font-mono text-stone-400 text-sm">
                          {String(i + 1).padStart(2, "0")}
                        </TableCell>
                        <TableCell className="font-semibold text-stone-900">
                          {f.name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-stone-500 max-w-xs truncate">
                          {f.description || "—"}
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-2 transition-opacity">
                            <Button
                              onClick={() => setViewingFormato(f)}
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-xl text-stone-400 hover:text-stone-900 transition-colors"
                            >
                              <Eye size={17} />
                            </Button>
                            <Button
                              onClick={() => openEdit(f)}
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-xl text-stone-400 hover:text-stone-900 transition-colors"
                            >
                              <Pencil size={17} />
                            </Button>
                            <Button
                              onClick={() => remove(f.id)}
                              disabled={deletingId === f.id}
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              {deletingId === f.id ? (
                                <Loader2 className="animate-spin" size={17} />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </Button>
                          </div>
                          {/* Visible en móvil siempre */}
                          <div className="md:hidden flex justify-end">
                            <ChevronRight
                              className="text-stone-300"
                              size={20}
                            />
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL CREAR / EDITAR */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[32px] border-none p-0 overflow-hidden shadow-2xl">
          <div className="bg-stone-900 p-8 text-white">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
              <Package size={24} />
            </div>
            <DialogTitle className="text-2xl font-bold">
              {editingFormato ? "Editar Formato" : "Nuevo Formato"}
            </DialogTitle>
            <DialogDescription className="text-stone-400">
              Ingresa los detalles para organizar tus productos.
            </DialogDescription>
          </div>
          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Nombre
                </label>
                <Input
                  placeholder="Ej: Galón 5 Litros"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="h-12 rounded-xl border-stone-100 bg-stone-50 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Descripción (Opcional)
                </label>
                <Input
                  placeholder="Ej: Envase plástico premium"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="h-12 rounded-xl border-stone-100 bg-stone-50 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 rounded-xl font-bold text-stone-500"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting || !formData.name}
                className="flex-[2] bg-stone-900 text-white rounded-xl font-bold h-12"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : editingFormato ? (
                  "Actualizar"
                ) : (
                  "Guardar"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE VISTA (DETALLES) */}
      <Dialog
        open={!!viewingFormato}
        onOpenChange={() => setViewingFormato(null)}
      >
        <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none p-0 overflow-hidden">
          <div className="bg-stone-50 p-8 border-b border-stone-100">
            <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-stone-200">
              <Info size={24} className="text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-stone-900">
              Detalles del Formato
            </DialogTitle>
          </div>
          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <Package size={12} /> Nombre
              </span>
              <p className="text-lg font-bold text-stone-900">
                {viewingFormato?.name}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <AlignLeft size={12} /> Descripción
              </span>
              <p className="text-stone-600 leading-relaxed italic">
                {viewingFormato?.description || "Sin descripción registrada."}
              </p>
            </div>
            <Button
              onClick={() => setViewingFormato(null)}
              className="w-full h-12 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800"
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
