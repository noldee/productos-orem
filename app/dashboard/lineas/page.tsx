"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner"; // Asegúrate de tener instalado 'next-themes' o 'sonner'
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Search,
  Folder,
  FileText,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Linea {
  id: number;
  name: string;
  description: string | null;
}

export default function LineasPage() {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
      console.error("Error al cargar líneas:", error);
      toast.error("No se pudieron cargar las líneas de producto", {
        duration: 2000,
      });
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
        toast.success("Línea actualizada correctamente", {
          duration: 2000,
        });
      } else {
        await api.post("/lineas", payload);
        toast.success("Línea creada exitosamente", {
          duration: 2000,
        });
      }
      setShowFormModal(false);
      fetchLineas();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Ocurrió un error al intentar guardar los cambios", {
        duration: 2000,
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("¿Eliminar esta línea de producto?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/lineas/${id}`);
      toast.success("Línea eliminada con éxito", {
        duration: 2000,
      });
      fetchLineas();
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("No se pudo eliminar la línea seleccionada", {
        duration: 2000,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLineas = lineas
    .filter(
      (l) =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        (l.description &&
          l.description.toLowerCase().includes(search.toLowerCase())) ||
        l.id.toString().includes(search),
    )
    .sort((a, b) => a.id - b.id);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-background min-h-screen text-foreground antialiased">
      {/* HEADER SIMPLIFICADO PROFESIONAL */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Líneas de Limpieza
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Administra el catálogo y familias de productos de tu inventario.
          </p>
        </div>
        <Button
          onClick={() => openForm()}
          className="bg-foreground text-background hover:bg-foreground/90 font-medium"
        >
          <Plus size={16} /> Agregar Línea
        </Button>
      </div>

      {/* TABLA ESTILO PRIMEFACES (DataTable Container) */}
      <Card className="border border-border/80 shadow-sm rounded-lg overflow-hidden bg-card">
        {/* Encabezado Interno (Filtro Global) */}
        <div className="p-4 bg-muted/20 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="font-medium text-sm text-muted-foreground">
            Total:{" "}
            <span className="text-foreground font-semibold">
              {filteredLineas.length}
            </span>{" "}
            registros
          </div>
          <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              placeholder="Buscar línea..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                    Nombre de Línea
                  </TableHead>
                  <TableHead className="h-11 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Descripción
                  </TableHead>
                  <TableHead className="h-11 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-right w-40">
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
                        <span>Sincronizando datos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredLineas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-32 text-center text-sm text-muted-foreground"
                    >
                      No se encontraron registros en esta sección.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLineas.map((linea) => (
                    <TableRow
                      key={linea.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        #{String(linea.id).padStart(3, "0")}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium text-foreground">
                        {linea.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-muted-foreground max-w-md truncate">
                        {linea.description || (
                          <span className="text-muted-foreground/40 italic text-xs">
                            Sin descripción
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openView(linea)}
                            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                            title="Visualizar"
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openForm(linea)}
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(linea.id)}
                            disabled={deletingId === linea.id}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            title="Eliminar"
                          >
                            {deletingId === linea.id ? (
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

      {/* MODAL: FORMULARIO MEJORADO */}
      <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
        <DialogContent className="sm:max-w-[420px] rounded-lg border-border bg-card p-0 overflow-hidden shadow-lg">
          <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
            <DialogTitle className="text-lg font-semibold text-foreground">
              {selectedLinea ? "Modificar Línea" : "Nueva Línea de Producto"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Ingresa la información básica para segmentar tus productos.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Folder size={14} className="text-primary/70" /> Nombre
                Comercial
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. DETERGENTES"
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
                placeholder="Detalle breve de la línea..."
                className="h-10 rounded-md border-border bg-background px-3 text-sm focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          <DialogFooter className="p-4 bg-muted/10 border-t border-border/60 flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowFormModal(false)}
              className="h-9 rounded-md border-border font-medium text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Descartar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="h-9 ml-2 bg-foreground text-background hover:bg-foreground/90 font-medium"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Guardar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: VISTA DE DETALLE */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[420px] rounded-lg border-border bg-card p-0 overflow-hidden shadow-lg">
          <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
            <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Eye size={18} className="text-blue-500" /> Vista de Detalle
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Información completa registrada en el sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4 text-sm">
            <div className="grid grid-cols-3 py-1.5 border-b border-border/40">
              <span className="text-muted-foreground font-medium">
                ID Interno:
              </span>
              <span className="col-span-2 font-mono text-xs text-foreground">
                #{selectedLinea?.id}
              </span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-border/40">
              <span className="text-muted-foreground font-medium">Nombre:</span>
              <span className="col-span-2 font-semibold text-foreground">
                {selectedLinea?.name}
              </span>
            </div>
            <div className="flex flex-col gap-1 py-1.5">
              <span className="text-muted-foreground font-medium">
                Descripción Completa:
              </span>
              <p className="text-muted-foreground bg-muted/30 p-3 rounded-md border border-border/40 min-h-[60px] italic">
                {selectedLinea?.description || "Sin descripción asignada."}
              </p>
            </div>
          </div>

          <DialogFooter className="p-4 bg-muted/10 border-t border-border/60">
            <Button
              onClick={() => setShowViewModal(false)}
              className="w-full sm:w-auto h-9 rounded-md bg-muted text-foreground hover:bg-muted/80 transition-colors border border-border text-sm font-medium"
            >
              Cerrar Vista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
