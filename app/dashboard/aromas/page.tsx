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
  Wind,
  Eye,
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
} from "@/components/ui/dialog";

interface Aroma {
  id: number;
  name: string;
  description: string | null;
}

export default function AromasPage() {
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Estado para el modal de vista
  const [viewingAroma, setViewingAroma] = useState<Aroma | null>(null);

  const fetchAromas = async () => {
    try {
      const { data } = await api.get("/aromas");
      setAromas(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAromas();
  }, []);

  const create = async () => {
    if (!newName.trim()) return;
    await api.post("/aromas", { name: newName, description: newDesc || null });
    setNewName("");
    setNewDesc("");
    setCreating(false);
    fetchAromas();
  };

  const update = async (id: number) => {
    const payload: any = {
      name: editName.trim(),
      description: editDesc || null,
    };

    try {
      await api.put(`/aromas/${id}`, payload);
      setEditingId(null);
      fetchAromas();
    } catch (e: any) {
      if (e.response?.data?.message?.includes("Unique")) {
        alert("Ya existe un aroma con ese nombre");
      }
    }
  };

  const startEdit = (a: Aroma) => {
    setEditingId(a.id);
    setEditName(a.name);
    setEditDesc(a.description ?? "");
  };

  const remove = async (id: number) => {
    if (!confirm("¿Eliminar este aroma?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/aromas/${id}`);
      fetchAromas();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full space-y-8 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-stone-900 flex items-center justify-center shadow-lg shadow-stone-200">
            <Wind size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
              Colección de Aromas
            </h1>
            <p className="text-stone-500 font-medium">
              {aromas.length}{" "}
              {aromas.length === 1
                ? "esencia disponible"
                : "esencias disponibles"}
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setCreating(true);
            setEditingId(null);
          }}
          disabled={creating}
          className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-8 py-6 h-auto gap-2 shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={18} /> Nuevo aroma
        </Button>
      </div>

      {/* Formulario Creación */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-2 border-stone-100 shadow-sm bg-stone-50/40 rounded-3xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                  <div className="md:col-span-4 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">
                      Nombre del Aroma
                    </label>
                    <Input
                      autoFocus
                      placeholder="Ej: Sándalo Real"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="rounded-2xl border-stone-200 bg-white h-12 focus:ring-2 focus:ring-stone-900/5"
                    />
                  </div>
                  <div className="md:col-span-5 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">
                      Descripción Detallada
                    </label>
                    <Input
                      placeholder="Notas olfativas, origen..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="rounded-2xl border-stone-200 bg-white h-12 focus:ring-2 focus:ring-stone-900/5"
                    />
                  </div>
                  <div className="md:col-span-3 flex gap-3">
                    <Button
                      onClick={create}
                      className="flex-1 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl h-12"
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setCreating(false)}
                      className="rounded-2xl h-12 px-6 hover:bg-stone-200"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabla */}
      <Card className="border-none shadow-xl shadow-stone-200/50 rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-32 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-stone-200" />
              <p className="text-stone-400 font-medium">Cargando catálogo...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50/50 hover:bg-stone-50/50 border-stone-100">
                  <TableHead className="w-[80px] pl-8 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    ID
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Aroma
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Descripción
                  </TableHead>
                  <TableHead className="text-right pr-8 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aromas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Wind className="h-12 w-12 text-stone-100" />
                        <p className="text-stone-400 text-lg font-medium">
                          No hay aromas registrados
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  aromas.map((aroma, i) => (
                    <TableRow
                      key={aroma.id}
                      className="group border-stone-50 hover:bg-stone-50/40 transition-all"
                    >
                      {editingId === aroma.id ? (
                        <>
                          <TableCell className="pl-8 font-mono text-stone-300">
                            {i + 1}
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="h-9 rounded-lg"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              className="h-9 rounded-lg"
                            />
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => update(aroma.id)}
                                className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-8 w-8 p-0"
                              >
                                <Check size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingId(null)}
                                className="h-8 w-8 p-0"
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="pl-8 text-stone-300 font-mono text-xs italic">
                            {String(i + 1).padStart(2, "0")}
                          </TableCell>
                          <TableCell className="font-semibold text-stone-800 py-5">
                            {aroma.name}
                          </TableCell>
                          <TableCell className="max-w-[300px]">
                            <p className="text-stone-500 text-sm truncate pr-10">
                              {aroma.description || "—"}
                            </p>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <div className="flex justify-end gap-1  transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewingAroma(aroma)}
                                className="h-9 w-9 rounded-xl text-stone-800 hover:text-blue-600 hover:bg-blue-50"
                              >
                                <Eye size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEdit(aroma)}
                                className="h-9 w-9 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(aroma.id)}
                                disabled={deletingId === aroma.id}
                                className="h-9 w-9 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50"
                              >
                                {deletingId === aroma.id ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Vista Detallada */}
      <Dialog
        open={!!viewingAroma}
        onOpenChange={(open) => !open && setViewingAroma(null)}
      >
        <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-900">
              <Wind size={24} />
            </div>
            <DialogTitle className="text-2xl font-bold text-stone-900">
              Detalles del Aroma
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Nombre Comercial
              </span>
              <p className="text-lg font-medium text-stone-800">
                {viewingAroma?.name}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Descripción Completa
              </span>
              <p className="text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-100">
                {viewingAroma?.description ||
                  "Este aroma no tiene una descripción registrada actualmente."}
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => setViewingAroma(null)}
              className="bg-stone-900 text-white rounded-xl px-6"
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
