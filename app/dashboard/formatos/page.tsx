"use client";

import { useEffect, useState, useMemo } from "react";
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
  Search,
  ChevronLeft,
  ChevronRight,
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

interface Formato {
  id: number;
  name: string;
  description: string | null;
}

export default function FormatosPage() {
  const [formatos, setFormatos] = useState<Formato[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados de Filtros y Paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Datos Formulario
  const [selectedFormato, setSelectedFormato] = useState<Formato | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchFormatos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/formatos");
      setFormatos(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Error al obtener formatos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormatos();
  }, []);

  // --- LÓGICA DE FILTRADO ---
  const filteredFormatos = useMemo(() => {
    return formatos.filter((f) => {
      const search = searchTerm.toLowerCase();
      return (
        f.name.toLowerCase().includes(search) ||
        (f.description?.toLowerCase() || "").includes(search)
      );
    });
  }, [formatos, searchTerm]);

  // --- LÓGICA DE PAGINACIÓN ---
  const totalPages = Math.ceil(filteredFormatos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFormatos.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Resetear página al buscar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const openForm = (formato?: Formato) => {
    if (formato) {
      setSelectedFormato(formato);
      setName(formato.name);
      setDescription(formato.description ?? "");
    } else {
      setSelectedFormato(null);
      setName("");
      setDescription("");
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const payload = { name, description: description || null };
      if (selectedFormato) {
        await api.put(`/formatos/${selectedFormato.id}`, payload);
      } else {
        await api.post("/formatos", payload);
      }
      setIsModalOpen(false);
      fetchFormatos();
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("¿Deseas eliminar este formato?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/formatos/${id}`);
      fetchFormatos();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-10 bg-background min-h-screen text-foreground">
      {/* HEADER DINÁMICO */}
      <div className="relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-6 bg-card p-8 rounded-[32px] border border-border">
        <div className="flex items-center gap-5 z-10 w-full lg:w-auto">
          <div className="w-16 h-16 rounded-[22px] bg-primary flex items-center justify-center ">
            <Package size={30} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Formatos</h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] opacity-60">
              {filteredFormatos.length} Presentaciones encontradas
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* BUSCADOR */}
          <div className="relative w-full sm:w-80 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
              size={18}
            />
            <Input
              placeholder="Buscar formato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-background/50 border-border rounded-2xl focus:ring-primary/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <Button
            onClick={() => openForm()}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-14 px-8 gap-3  font-bold active:scale-95 transition-all"
          >
            <Plus size={20} /> Nuevo Formato
          </Button>
        </div>
      </div>

      {/* CONTENEDOR DE TABLA */}
      <Card className="border-border rounded-[35px] overflow-hidden bg-card/30 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="py-6 pl-8 text-primary font-bold text-[10px] tracking-[0.2em] w-24">
                    ID
                  </TableHead>
                  <TableHead className="text-muted-foreground font-bold text-[10px] tracking-[0.2em]">
                    NOMBRE DEL FORMATO
                  </TableHead>
                  <TableHead className="text-muted-foreground font-bold text-[10px] tracking-[0.2em] hidden md:table-cell">
                    DESCRIPCIÓN TÉCNICA
                  </TableHead>
                  <TableHead className="text-right pr-8 text-muted-foreground font-bold text-[10px] tracking-[0.2em]">
                    ACCIONES
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-32 text-center">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary/40" />
                    </TableCell>
                  </TableRow>
                ) : currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-32 text-center text-muted-foreground italic"
                    >
                      No se encontraron resultados para tu búsqueda.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((f, i) => (
                    <TableRow
                      key={f.id}
                      className="border-border/5 group hover:bg-primary/[0.03] transition-colors"
                    >
                      <TableCell className="py-5 pl-8 font-mono text-primary/50 text-xs">
                        #{String(indexOfFirstItem + i + 1).padStart(2, "0")}
                      </TableCell>
                      <TableCell className="font-bold text-foreground text-lg">
                        {f.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground/60 italic text-sm hidden md:table-cell max-w-xs truncate">
                        {f.description || "Sin descripción registrada"}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedFormato(f);
                              setIsViewOpen(true);
                            }}
                            className="h-11 w-11 rounded-xl bg-background/50 text-muted-foreground hover:text-primary border border-border/50 hover:scale-105 transition-all"
                          >
                            <Eye size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openForm(f)}
                            className="h-11 w-11 rounded-xl bg-background/50 text-muted-foreground hover:text-emerald-400 border border-border/50 hover:scale-105 transition-all"
                          >
                            <Pencil size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(f.id)}
                            disabled={deletingId === f.id}
                            className="h-11 w-11 rounded-xl bg-background/50 text-muted-foreground hover:text-destructive border border-border/50 hover:scale-105 transition-all"
                          >
                            {deletingId === f.id ? (
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

          {/* PAGINACIÓN ESTILO PREMIUM */}
          {!loading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-10 py-8 border-t border-border/20 bg-muted/5 gap-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Página <span className="text-primary">{currentPage}</span> de{" "}
                {totalPages}
              </span>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="h-11 px-4 rounded-xl border-border hover:text-primary disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={18} className="mr-2" /> Anterior
                </Button>

                <div className="hidden sm:flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                          currentPage === p
                            ? "bg-primary text-primary-foreground scale-110"
                            : "text-muted-foreground hover:bg-border/40"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="h-11 px-4 rounded-xl border-border hover:text-primary disabled:opacity-20 transition-all"
                >
                  Siguiente <ChevronRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL CREAR / EDITAR */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[40px] border-border bg-card p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-transparent to-transparent p-10 border-b border-border/50">
            <DialogTitle className="text-3xl font-bold">
              {selectedFormato ? "Editar Formato" : "Nuevo Formato"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2 font-medium">
              Define las dimensiones y capacidades de tus productos.
            </DialogDescription>
          </div>
          <div className="p-10 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary ml-1">
                Nombre Comercial
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Galón 5 Litros"
                className="h-14 rounded-2xl bg-background border-border focus:ring-2 ring-primary/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary ml-1">
                Descripción de Envase
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Polietileno de alta densidad"
                className="h-14 rounded-2xl bg-background border-border focus:ring-2 ring-primary/10"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-14 rounded-2xl font-bold text-muted-foreground"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting || !name.trim()}
                className="flex-[2] h-14 rounded-2xl bg-primary text-primary-foreground font-bold"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : selectedFormato ? (
                  "Actualizar Registro"
                ) : (
                  "Guardar Formato"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE VISTA DETALLES */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[40px] border-border bg-card p-10">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
              <Package size={40} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                Ficha Técnica
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                Información del Formato
              </DialogDescription>
            </div>
          </div>

          <div className="space-y-6 bg-muted/30 p-8 rounded-[30px] border border-border/50">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Nombre de Presentación
              </p>
              <p className="text-2xl font-bold text-foreground">
                {selectedFormato?.name}
              </p>
            </div>
            <div className="h-px bg-border/40 w-full" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <AlignLeft size={12} /> Especificaciones
              </p>
              <p className="text-foreground/80 text-sm leading-relaxed italic">
                {selectedFormato?.description ||
                  "No se han especificado detalles adicionales para este formato de empaque."}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsViewOpen(false)}
            className="w-full mt-8 h-14 rounded-2xl bg-foreground text-background hover:opacity-90 font-bold transition-all"
          >
            Cerrar Vista
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
