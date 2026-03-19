"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Layers,
  Eye,
  Info,
  X,
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
  const [showFormModal, setShowFormModal] = useState(false);
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
    setShowFormModal(true);
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
      setShowFormModal(false);
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
    <div className="w-full space-y-6 p-4 md:p-8 bg-background min-h-screen selection:bg-primary/20">
      {/* HEADER COMPACTO PREMIUM */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-4 bg-card p-6 rounded-[28px] border border-border">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center  shrink-0">
            <Layers size={26} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Líneas <span className="text-primary">Pro</span>
            </h1>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
              {lineas.length} registros
            </p>
          </div>
        </div>

        <Button
          onClick={() => openForm()}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-6 gap-2 shadow-lg shadow-primary/10 font-bold transition-all active:scale-95"
        >
          <Plus size={18} /> Nueva Línea
        </Button>
      </div>

      {/* TABLA REFINADA */}
      <Card className="border-border rounded-[28px] overflow-hidden bg-card/40 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="py-4 pl-8 text-primary font-bold text-[10px] tracking-[0.2em] w-20">
                      ORDEN
                    </TableHead>
                    <TableHead className="text-muted-foreground font-bold text-[10px] tracking-[0.2em]">
                      NOMBRE
                    </TableHead>
                    <TableHead className="text-muted-foreground font-bold text-[10px] tracking-[0.2em]">
                      DETALLES
                    </TableHead>
                    <TableHead className="text-right pr-8 text-muted-foreground font-bold text-[10px] tracking-[0.2em] w-48">
                      ACCIONES
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-24 text-center">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary/50" />
                      </TableCell>
                    </TableRow>
                  ) : lineas.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-24 text-center text-muted-foreground italic"
                      >
                        No hay líneas registradas.
                      </TableCell>
                    </TableRow>
                  ) : (
                    lineas.map((linea, i) => (
                      <TableRow
                        key={linea.id}
                        className="border-border/10 group hover:bg-primary/[0.02] transition-colors"
                      >
                        <TableCell className="py-4 pl-8 font-mono text-primary/60 text-xs">
                          {String(i + 1).padStart(2, "0")}
                        </TableCell>
                        <TableCell className="font-bold text-foreground">
                          {linea.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground/50 italic text-xs max-w-[300px] truncate">
                          {linea.description || "— Sin descripción —"}
                        </TableCell>

                        {/* ACCIONES FIJAS */}
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openView(linea)}
                              className="h-9 w-9 rounded-lg bg-background/40 text-muted-foreground hover:text-primary border border-border/50 transition-all hover:scale-110"
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openForm(linea)}
                              className="h-9 w-9 rounded-lg bg-background/40 text-muted-foreground hover:text-green-400 border border-border/50 transition-all hover:scale-110"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(linea.id)}
                              disabled={deletingId === linea.id}
                              className="h-9 w-9 rounded-lg bg-background/40 text-muted-foreground hover:text-destructive border border-border/50 transition-all hover:scale-110"
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
          </div>
        </CardContent>
      </Card>

      {/* MODAL: FORMULARIO (CREAR/EDITAR) */}
      <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
        <DialogContent className="sm:max-w-[440px] rounded-[32px] border-border bg-card p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 to-transparent p-8 border-b border-border">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {selectedLinea ? "Editar Línea" : "Nueva Línea"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs mt-1 uppercase tracking-widest font-bold">
              Completa los datos de la familia
            </DialogDescription>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                Nombre Comercial
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Línea Industrial"
                className="h-12 rounded-xl bg-background border-border focus:ring-primary focus:border-primary px-4"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                Descripción corta
              </label>
              <Input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Opcional..."
                className="h-12 rounded-xl bg-background border-border focus:ring-primary focus:border-primary px-4"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowFormModal(false)}
                className="flex-1 h-12 rounded-xl border-border hover:bg-secondary font-bold"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
              >
                {saving ? <Loader2 className="animate-spin" /> : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: VER DETALLE */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[460px] rounded-[32px] border-border bg-card p-8 shadow-2xl">
          <DialogHeader className="flex flex-row items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Info size={24} />
            </div>
            <div className="text-left">
              <DialogTitle className="text-2xl font-bold">
                Detalle de Línea
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Información del sistema
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-background/50 border border-border">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
                Nombre
              </p>
              <p className="text-xl font-bold text-foreground mb-4">
                {selectedLinea?.name}
              </p>
              <div className="h-px w-full bg-border/40 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
                Descripción
              </p>
              <p className="text-muted-foreground italic text-sm leading-relaxed">
                {selectedLinea?.description ||
                  "No se ha proporcionado una descripción detallada para esta línea."}
              </p>
            </div>
            <Button
              onClick={() => setShowViewModal(false)}
              className="w-full h-12 rounded-xl bg-secondary text-foreground hover:bg-border font-bold"
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
