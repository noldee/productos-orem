"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Pencil, Trash2, Plus, Loader2, Layers, Eye, Info } from "lucide-react";

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
} from "@/components/ui/dialog";

interface Linea {
  id: number;
  name: string;
  description: string | null;
}

export default function LineasPage() {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [loading, setLoading] = useState(true);

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Estados de datos
  const [selectedLinea, setSelectedLinea] = useState<Linea | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchLineas = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/lineas");
      setLineas(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLineas();
  }, []);

  const openForm = (linea?: Linea) => {
    if (linea) {
      setSelectedLinea(linea);
      setName(linea.name);
      setDesc(linea.description ?? "");
    } else {
      setSelectedLinea(null);
      setName("");
      setDesc("");
    }
    setShowModal(true);
  };

  const openView = (linea: Linea) => {
    setSelectedLinea(linea);
    setShowViewModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const payload = { name, description: desc || null };
      if (selectedLinea) {
        await api.put(`/lineas/${selectedLinea.id}`, payload);
      } else {
        await api.post("/lineas", payload);
      }
      setShowModal(false);
      fetchLineas();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("¿Deseas eliminar esta línea?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/lineas/${id}`);
      fetchLineas();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-8 p-4 md:p-10 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-stone-50 p-6 md:p-8 rounded-[32px] border border-stone-100 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[22px] bg-stone-900 flex items-center justify-center shadow-xl shadow-stone-200">
            <Layers size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
              Líneas
            </h1>
            <p className="text-stone-500 font-medium">
              {lineas.length} registros encontrados
            </p>
          </div>
        </div>
        <Button
          onClick={() => openForm()}
          className="w-full md:w-auto bg-stone-900 hover:bg-stone-800 text-white rounded-2xl h-14 px-8 gap-3"
        >
          <Plus size={20} /> Nueva Línea
        </Button>
      </div>

      {/* Tabla Principal */}
      <Card className="border-none shadow-2xl shadow-stone-100 rounded-[32px] overflow-hidden bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-32 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-stone-200" />
              <p className="text-stone-400 text-sm font-medium">
                Cargando datos...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-50/50">
                  <TableRow className="border-stone-100">
                    <TableHead className="py-6 pl-8 text-stone-400 font-bold uppercase text-[10px] tracking-widest w-16">
                      #
                    </TableHead>
                    <TableHead className="text-stone-400 font-bold uppercase text-[10px] tracking-widest min-w-[200px]">
                      Nombre
                    </TableHead>
                    <TableHead className="text-stone-400 font-bold uppercase text-[10px] tracking-widest hidden md:table-cell">
                      Descripción
                    </TableHead>
                    <TableHead className="text-right pr-8 text-stone-400 font-bold uppercase text-[10px] tracking-widest w-40">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineas.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-48 text-center text-stone-400 italic"
                      >
                        No hay líneas registradas aún.
                      </TableCell>
                    </TableRow>
                  ) : (
                    // EL CAMBIO ESTÁ AQUÍ: Usamos "i" para la numeración
                    lineas.map((linea, i) => (
                      <TableRow
                        key={linea.id}
                        className="border-stone-50 group hover:bg-stone-50/30 transition-colors"
                      >
                        <TableCell className="py-5 pl-8 font-mono text-stone-400 text-xs">
                          {/* Esto garantiza orden del 1 al N */}
                          {String(i + 1).padStart(2, "0")}
                        </TableCell>
                        <TableCell className="font-bold text-stone-800">
                          <span className="truncate block max-w-[250px]">
                            {linea.name}
                          </span>
                        </TableCell>
                        <TableCell className="text-stone-500 hidden md:table-cell">
                          <p className="line-clamp-1 italic max-w-[400px] text-sm">
                            {linea.description || "—"}
                          </p>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openView(linea)}
                              className="h-9 w-9 rounded-xl text-stone-400 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openForm(linea)}
                              className="h-9 w-9 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(linea.id)}
                              disabled={deletingId === linea.id}
                              className="h-9 w-9 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50"
                            >
                              {deletingId === linea.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
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
          )}
        </CardContent>
      </Card>

      {/* DIALOG: CREAR / EDITAR */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[450px] rounded-[32px] border-none p-0 overflow-hidden shadow-2xl">
          <div className="bg-stone-900 p-8 text-white">
            <DialogTitle className="text-2xl font-bold">
              {selectedLinea ? "Editar Línea" : "Nueva Línea"}
            </DialogTitle>
          </div>
          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Nombre
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Descripción
              </label>
              <Input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 h-12 rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 h-12 rounded-xl bg-stone-900 text-white font-bold"
              >
                {saving ? <Loader2 className="animate-spin" /> : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG: VISTA DETALLADA (SOLO LECTURA) */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[500px] rounded-[32px] border-none p-0 overflow-hidden shadow-2xl bg-stone-50">
          {/* Agregamos DialogHeader y DialogTitle aquí */}
          <DialogHeader className="sr-only">
            <DialogTitle>Detalle de la Línea</DialogTitle>
          </DialogHeader>

          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 text-stone-900">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-stone-100">
                <Info size={24} className="text-stone-900" />
              </div>
              {/* Cambiamos el h2 por DialogTitle si quieres que sea el título oficial, 
            o lo dejamos así si ya pusimos el SR-ONLY arriba */}
              <h2 className="text-2xl font-bold">Detalle de la Línea</h2>
            </div>

            <div className="bg-white p-6 rounded-[24px] border border-stone-100 space-y-4 shadow-sm">
              <div>
                <p className="text-[10px] font-bold uppercase text-stone-400 mb-1">
                  Nombre Comercial
                </p>
                <p className="text-lg font-semibold text-stone-900">
                  {selectedLinea?.name}
                </p>
              </div>
              <div className="pt-4 border-t border-stone-50">
                <p className="text-[10px] font-bold uppercase text-stone-400 mb-1">
                  Descripción Completa
                </p>
                <p className="text-stone-600 leading-relaxed italic">
                  {selectedLinea?.description ||
                    "No tiene una descripción registrada."}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowViewModal(false)}
              className="w-full h-12 rounded-xl bg-stone-900 text-white font-bold"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
