"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Pencil, Trash2, Plus, Check, X, Loader2, Search } from "lucide-react";

// Importaciones de Shadcn UI (Asegurate de tener estos componentes instalados)
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Linea {
  id: number;
  name: string;
  description: string | null;
}

export default function LineasPage() {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const fetchLineas = async () => {
    try {
      const { data } = await api.get("/lineas");
      setLineas(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLineas();
  }, []);

  const create = async () => {
    if (!newName.trim()) return;
    await api.post("/lineas", { name: newName, description: newDesc || null });
    setNewName("");
    setNewDesc("");
    setCreating(false);
    fetchLineas();
  };

  const update = async (id: number) => {
    await api.put(`/lineas/${id}`, {
      name: editName,
      description: editDesc || null,
    });
    setEditingId(null);
    fetchLineas();
  };

  const remove = async (id: number) => {
    if (!confirm("¿Eliminar esta línea?")) return;
    await api.delete(`/lineas/${id}`);
    fetchLineas();
  };

  const startEdit = (linea: Linea) => {
    setEditingId(linea.id);
    setEditName(linea.name);
    setEditDesc(linea.description ?? "");
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Líneas de Productos
          </h1>
          <p className="text-muted-foreground">
            Gestiona las categorías principales de tu inventario.
          </p>
        </div>
        <Button
          onClick={() => setCreating(true)}
          disabled={creating}
          className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-6"
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva línea
        </Button>
      </div>

      {/* Formulario de Creación */}
      {creating && (
        <Card className="border-2 border-stone-100 shadow-md">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4 space-y-2">
                <label className="text-xs font-bold uppercase text-stone-500">
                  Nombre
                </label>
                <Input
                  autoFocus
                  placeholder="Ej: Línea Facial"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="md:col-span-6 space-y-2">
                <label className="text-xs font-bold uppercase text-stone-500">
                  Descripción
                </label>
                <Input
                  placeholder="Descripción opcional..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button
                  onClick={create}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCreating(false)}
                  className="flex-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla Principal */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-stone-300" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-stone-50/50">
                <TableRow>
                  <TableHead className="w-[30%] font-bold uppercase text-[11px] tracking-wider">
                    Nombre
                  </TableHead>
                  <TableHead className="font-bold uppercase text-[11px] tracking-wider">
                    Descripción
                  </TableHead>
                  <TableHead className="text-right font-bold uppercase text-[11px] tracking-wider">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No se encontraron líneas registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  lineas.map((linea) => (
                    <TableRow
                      key={linea.id}
                      className="group transition-colors hover:bg-stone-50/50"
                    >
                      {editingId === linea.id ? (
                        <>
                          <TableCell>
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="sm"
                              onClick={() => update(linea.id)}
                              className="bg-stone-900 text-white"
                            >
                              <Check size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingId(null)}
                            >
                              <X size={14} />
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium text-stone-900 text-base">
                            {linea.name}
                          </TableCell>
                          <TableCell className="text-stone-500 italic text-base">
                            {linea.description || (
                              <span className="text-stone-300 not-italic">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEdit(linea)}
                                className="h-8 w-8 text-stone-400 hover:text-stone-900"
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(linea.id)}
                                className="h-8 w-8 text-stone-400 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
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
    </div>
  );
}
