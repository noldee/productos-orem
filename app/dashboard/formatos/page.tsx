"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2, Eye, Search } from "lucide-react";
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

interface Formato {
  id: number;
  name: string;
  description: string | null;
}

export default function FormatosPage() {
  const [formatos, setFormatos] = useState<Formato[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estados de Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Datos temporales
  const [selectedFormato, setSelectedFormato] = useState<Formato | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchFormatos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/formatos");
      setFormatos(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Error al obtener formatos:", error);
      toast.error("No se pudieron cargar los formatos de producto", {
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormatos();
  }, []);

  // Filtro simple por string
  const filteredFormatos = useMemo(() => {
    return formatos.filter((f) => {
      const search = searchTerm.toLowerCase();
      return (
        f.name.toLowerCase().includes(search) ||
        (f.description?.toLowerCase() || "").includes(search)
      );
    });
  }, [formatos, searchTerm]).sort((a, b) => a.id - b.id);

  // Paginación manual
  const totalPages = Math.ceil(filteredFormatos.length / itemsPerPage) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFormatos.slice(start, start + itemsPerPage);
  }, [filteredFormatos, currentPage]);

  const openForm = (formato?: Formato) => {
    if (formato) {
      setSelectedFormato(formato);
      setName(formato.name);
      setDesc(formato.description ?? "");
    } else {
      setSelectedFormato(null);
      setName("");
      setDesc("");
    }
    setShowFormModal(true);
  };

  const openView = (formato: Formato) => {
    setSelectedFormato(formato);
    setShowViewModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const payload = { name, description: desc || null };
      if (selectedFormato) {
        await api.put(`/formatos/${selectedFormato.id}`, payload);
        toast.success("Formato actualizado correctamente", {
          duration: 2000,
        });
      } else {
        await api.post("/formatos", payload);
        toast.success("Formato creado exitosamente", {
          duration: 2000,
        });
      }
      setShowFormModal(false);
      fetchFormatos();
    } catch (error: any) {
      console.error("Error al guardar:", error);
      toast.error("Ocurrió un error al intentar guardar los cambios", {
        duration: 2000,
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("¿Eliminar este formato de producto?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/formatos/${id}`);
      toast.success("Formato eliminado con éxito", {
        duration: 2000,
      });
      fetchFormatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("No se pudo eliminar el formato seleccionado", {
        duration: 2000,
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-4 p-6 bg-background">
      {/* HEADER IDÉNTICO A LÍNEAS DE LIMPIEZA */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Formatos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra el catálogo y familias de productos de tu inventario.
          </p>
        </div>
        <Button
          onClick={() => openForm()}
          className="bg-foreground text-background hover:bg-foreground/90 font-medium"
        >
          <Plus size={16} className="mr-2" /> Agregar Línea
        </Button>
      </div>

      {/* CONTENEDOR DE TABLA ESTÁNDAR */}
      <Card className="border border-border rounded-lg shadow-sm bg-card">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60">
          <span className="text-sm text-muted-foreground font-medium">
            Total: {filteredFormatos.length} registros
          </span>
          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Buscar línea..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 bg-background border-border"
            />
          </div>
        </div>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-24">
                    ID
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    NOMBRE DE LÍNEA
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    DESCRIPCIÓN
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right pr-6 w-32">
                    ACCIONES
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/40">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground/60" />
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      No se encontraron registros.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((f) => (
                    <tr
                      key={f.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4 align-middle text-sm font-mono text-muted-foreground">
                        #{String(f.id).padStart(3, "0")}
                      </td>
                      <td className="py-3 px-4 align-middle text-sm font-semibold text-foreground">
                        {f.name}
                      </td>
                      <td className="py-3 px-4 align-middle text-sm text-muted-foreground">
                        {f.description || "— Sin descripción —"}
                      </td>
                      <td className="py-3 px-4 align-middle text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openView(f)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openForm(f)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(f.id)}
                            disabled={deletingId === f.id}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            {deletingId === f.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN LIMPIA */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
            <span className="text-xs text-muted-foreground font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 text-xs"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="h-8 text-xs"
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODAL FORMULARIO: REGISTRO / EDICIÓN */}
      <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
        <DialogContent className="sm:max-w-[420px] p-6 bg-card border border-border rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              {selectedFormato ? "Editar Línea" : "Agregar Línea"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Administra los datos de la familia seleccionada.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Nombre de Línea
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Botella 1L"
                className="h-9 bg-background border-border"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Descripción
              </label>
              <Input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Ej. Envase PET tradicional"
                className="h-9 bg-background border-border"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFormModal(false)}
              className="h-9"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              size="sm"
              className="h-9 ml-2 bg-foreground text-background hover:bg-foreground/90 font-medium"
            >
              {saving ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Guardar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: VISTA DE DETALLES */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[420px] p-6 bg-card border border-border rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              Detalles de la Línea
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Información completa del registro seleccionado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 my-4 text-sm border border-border/60 p-4 rounded-md bg-muted/10">
            <div>
              <span className="text-xs font-medium text-muted-foreground block">
                ID Registro
              </span>
              <span className="font-mono text-foreground">
                #{String(selectedFormato?.id).padStart(3, "0")}
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground block">
                Nombre
              </span>
              <span className="font-medium text-foreground">
                {selectedFormato?.name}
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground block">
                Descripción
              </span>
              <span className="text-foreground">
                {selectedFormato?.description || "— Sin descripción asignada —"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowViewModal(false)}
              size="sm"
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
