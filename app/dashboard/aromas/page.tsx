"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Eye,
  Search,
  ArrowUpDown, // <-- Faltaba este icono
  ArrowUp, // <-- Faltaba este icono
  ArrowDown, // <-- Faltaba este icono
} from "lucide-react";
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

// TanStack Table completo
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel, // <-- Asegúrate de que se importe correctamente
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

interface Aroma {
  id: number;
  name: string;
  description: string | null;
}

export default function AromasPage() {
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [loading, setLoading] = useState(true);

  // TanStack state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Estados de datos
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
    } catch (error) {
      console.error("Error al cargar aromas:", error);
      toast.error("No se pudieron cargar los aromas de producto", {
        duration: 2000,
      });
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
        toast.success("Aroma actualizado correctamente", {
          duration: 2000,
        });
      } else {
        await api.post("/aromas", payload);
        toast.success("Aroma creado exitosamente", {
          duration: 2000,
        });
      }
      setShowFormModal(false);
      fetchAromas();
    } catch (error: any) {
      console.error("Error al guardar:", error);
      if (error.response?.data?.message?.includes("Unique")) {
        toast.error("Ya existe un aroma con ese nombre", { duration: 2000 });
      } else {
        toast.error("Ocurrió un error al intentar guardar los cambios", {
          duration: 2000,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("¿Eliminar este aroma de producto?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/aromas/${id}`);
      toast.success("Aroma eliminado con éxito", {
        duration: 2000,
      });
      fetchAromas();
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("No se pudo eliminar el aroma seleccionado", {
        duration: 2000,
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ─── COLUMNAS SIMPLES Y ORDENABLES ───────────────────────────────────────────
  // ─── COLUMNAS SIMPLES Y ORDENABLES ───────────────────────────────────────────
  const columns = useMemo<ColumnDef<Aroma>[]>(
    () => [
      {
        id: "numero", // Usamos un ID único para la columna de numeración
        header: "N°",
        cell: ({ row }) => {
          // row.index arranca en 0, así que le sumamos 1 para que muestre 1, 2, 3, 4...
          return (
            <span className="text-muted-foreground font-mono text-sm">
              #{row.index + 1}
            </span>
          );
        },
      },
      {
        accessorKey: "name",
        header: "NOMBRE DE FRAGANCIA",
        cell: ({ getValue }) => (
          <span className="font-semibold text-foreground text-sm">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "DESCRIPCIÓN",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground text-sm">
            {(getValue() as string) || "— Sin descripción —"}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Acciones</span>,
        cell: ({ row }) => {
          const aroma = row.original;
          return (
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openView(aroma)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Eye size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openForm(aroma)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(aroma.id)}
                disabled={deletingId === aroma.id}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                {deletingId === aroma.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </Button>
            </div>
          );
        },
      },
    ],
    [deletingId],
  );

  const table = useReactTable({
    data: aromas,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), // <-- Esta función procesa el orden real en pantalla
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
      sorting: [{ id: "id", desc: false }],
    },
  });

  return (
    <div className="w-full space-y-4 p-6 bg-background">
      {/* HEADER LIMPIO COMO LAS OTRAS SECCIONES */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Aromas
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

      {/* CONTENEDOR PRINCIPAL */}
      <Card className="border border-border rounded-lg shadow-sm bg-card">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60">
          <span className="text-sm text-muted-foreground font-medium">
            Total: {table.getFilteredRowModel().rows.length} registros
          </span>
          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Buscar línea..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 h-9 bg-background border-border"
            />
          </div>
        </div>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="border-b border-border bg-muted/20"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="divide-y divide-border/40">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="py-12 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground/60" />
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      No se encontraron registros.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="py-3 px-4 align-middle text-sm"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN ESTÁNDAR */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
            <span className="text-xs text-muted-foreground font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 text-xs"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 text-xs"
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODAL: FORMULARIO NORMAL */}
      <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
        <DialogContent className="sm:max-w-[420px] p-6 bg-card border border-border rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              {selectedAroma ? "Editar Línea" : "Agregar Línea"}
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
                placeholder="Ej. Lavanda"
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
                placeholder="Solo detergentes con aroma a lavanda"
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

      {/* MODAL: DETALLES VISTA REAL */}
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
                #{String(selectedAroma?.id).padStart(3, "0")}
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground block">
                Nombre
              </span>
              <span className="font-medium text-foreground">
                {selectedAroma?.name}
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground block">
                Descripción
              </span>
              <span className="text-foreground">
                {selectedAroma?.description || "— Sin descripción asignada —"}
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
