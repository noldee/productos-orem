"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Pencil, Trash2, Plus, Loader2, Wind, Eye, Info } from "lucide-react";
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

interface Aroma {
  id: number;
  name: string;
  description: string | null;
}

export default function AromasPage() {
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [loading, setLoading] = useState(true);

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Datos
  const [selectedAroma, setSelectedAroma] = useState<Aroma | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAromas = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/aromas");
      setAromas(Array.isArray(data) ? data : data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAromas();
  }, []);

  const openForm = (aroma?: Aroma) => {
    if (aroma) {
      setSelectedAroma(aroma);
      setName(aroma.name);
      setDesc(aroma.description ?? "");
    } else {
      setSelectedAroma(null);
      setName("");
      setDesc("");
    }
    setShowFormModal(true);
  };

  const openView = (aroma: Aroma) => {
    setSelectedAroma(aroma);
    setShowViewModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const payload = { name, description: desc || null };
      if (selectedAroma) {
        await api.put(`/aromas/${selectedAroma.id}`, payload);
      } else {
        await api.post("/aromas", payload);
      }
      setShowFormModal(false);
      fetchAromas();
    } catch (e: any) {
      if (e.response?.data?.message?.includes("Unique")) {
        alert("Ya existe un aroma con ese nombre");
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("¿Deseas eliminar este aroma?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/aromas/${id}`);
      fetchAromas();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-8 bg-background min-h-screen">
      {/* HEADER: Siguiendo la línea "Pro" */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-4 bg-card p-6 rounded-[28px] border border-border">
        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Wind size={26} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Aromas <span className="text-primary">Pro</span>
            </h1>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
              {aromas.length} fragancias
            </p>
          </div>
        </div>

        <Button
          onClick={() => openForm()}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-8 gap-2 font-bold active:scale-95"
        >
          <Plus size={18} /> Nuevo Aroma
        </Button>
      </div>

      {/* TABLA: Acciones fijas y Scroll refinado */}
      <Card className="border-border  rounded-[28px] overflow-hidden bg-card/40 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="py-4 pl-8 text-primary font-bold text-[10px] tracking-[0.2em] w-20">
                      ID
                    </TableHead>
                    <TableHead className="text-muted-foreground font-bold text-[10px] tracking-[0.2em]">
                      FRAGANCIA
                    </TableHead>
                    <TableHead className="text-muted-foreground font-bold text-[10px] tracking-[0.2em]">
                      NOTAS OLFATIVAS
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
                  ) : aromas.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-24 text-center text-muted-foreground italic"
                      >
                        No hay aromas en la colección.
                      </TableCell>
                    </TableRow>
                  ) : (
                    aromas.map((aroma, i) => (
                      <TableRow
                        key={aroma.id}
                        className="border-border/10 group hover:bg-primary/[0.02] transition-colors"
                      >
                        <TableCell className="py-4 pl-8 font-mono text-primary/60 text-xs italic">
                          {String(i + 1).padStart(2, "0")}
                        </TableCell>
                        <TableCell className="font-bold text-foreground">
                          {aroma.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground/50 italic text-xs max-w-[300px] truncate">
                          {aroma.description || "— Sin descripción —"}
                        </TableCell>

                        {/* ACCIONES FIJAS (Sin hover delay) */}
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openView(aroma)}
                              className="h-9 w-9 rounded-lg bg-background/40 text-muted-foreground hover:text-primary border border-border/50 hover:scale-110"
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openForm(aroma)}
                              className="h-9 w-9 rounded-lg bg-background/40 text-muted-foreground hover:text-green-400 border border-border/50 hover:scale-110"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(aroma.id)}
                              disabled={deletingId === aroma.id}
                              className="h-9 w-9 rounded-lg bg-background/40 text-muted-foreground hover:text-destructive border border-border/50 hover:scale-110"
                            >
                              {deletingId === aroma.id ? (
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

      {/* MODAL: FORMULARIO */}
      <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
        <DialogContent className="sm:max-w-[440px] rounded-[32px] border-border bg-card p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 to-transparent p-8 border-b border-border">
            <DialogTitle className="text-2xl font-bold">
              {selectedAroma ? "Editar Aroma" : "Nuevo Aroma"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-[10px] mt-1 uppercase tracking-widest font-bold">
              Define la esencia del producto
            </DialogDescription>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                Nombre de Fragancia
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Lavanda Silvestre"
                className="h-12 rounded-xl bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                Descripción / Notas
              </label>
              <Input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Ej. Notas cítricas y frescas..."
                className="h-12 rounded-xl bg-background border-border"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowFormModal(false)}
                className="flex-1 h-12 rounded-xl font-bold"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold"
              >
                {saving ? <Loader2 className="animate-spin" /> : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: VISTA */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[460px] rounded-[32px] border-border bg-card p-8">
          <DialogHeader className="flex flex-row items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Wind size={24} />
            </div>
            <div className="text-left">
              <DialogTitle className="text-2xl font-bold">
                Perfil del Aroma
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Catálogo Maestro
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="p-6 rounded-2xl bg-background/50 border border-border mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
              Fragancia
            </p>
            <p className="text-xl font-bold text-foreground mb-4">
              {selectedAroma?.name}
            </p>
            <div className="h-px w-full bg-border/40 mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
              Notas Olfativas
            </p>
            <p className="text-muted-foreground italic text-sm">
              {selectedAroma?.description ||
                "No hay notas específicas para esta esencia."}
            </p>
          </div>
          <Button
            onClick={() => setShowViewModal(false)}
            className="w-full h-12 rounded-xl bg-secondary text-foreground hover:bg-border font-bold"
          >
            Cerrar Vista
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
