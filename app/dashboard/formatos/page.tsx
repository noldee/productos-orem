"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Pencil, Trash2, Plus, Check, X, Loader2, Package } from "lucide-react";
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

interface Formato {
  id: number;
  name: string;
  description: string | null;
}

export default function FormatosPage() {
  const [formatos, setFormatos] = useState<Formato[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetch = async () => {
    try {
      const { data } = await api.get("/formatos");
      setFormatos(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const create = async () => {
    if (!newName.trim()) return;
    await api.post("/formatos", {
      name: newName,
      description: newDesc || null,
    });
    setNewName("");
    setNewDesc("");
    setCreating(false);
    fetch();
  };

  const update = async (id: number) => {
    await api.put(`/formatos/${id}`, {
      name: editName,
      description: editDesc || null,
    });
    setEditingId(null);
    fetch();
  };

  const remove = async (id: number) => {
    setDeletingId(id);
    await api.delete(`/formatos/${id}`);
    setDeletingId(null);
    fetch();
  };

  const startEdit = (f: Formato) => {
    setEditingId(f.id);
    setEditName(f.name);
    setEditDesc(f.description ?? "");
  };

  return (
    <div className="w-full space-y-8 p-4 md:p-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-stone-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center">
            <Package size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Formatos
            </h1>
            <p className="text-sm text-stone-400 mt-0.5">
              {formatos.length}{" "}
              {formatos.length === 1
                ? "formato registrado"
                : "formatos registrados"}
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setCreating(true);
            setEditingId(null);
          }}
          disabled={creating}
          className="bg-stone-900 hover:bg-stone-700 text-white rounded-full px-6 gap-2 shadow-sm"
        >
          <Plus size={15} /> Nuevo formato
        </Button>
      </div>

      {/* Formulario Creación */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border border-stone-200 shadow-sm bg-stone-50/60 rounded-2xl">
              <CardContent className="pt-6 pb-5">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">
                  Nuevo Formato
                </p>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Nombre *
                    </label>
                    <Input
                      autoFocus
                      placeholder="Ej: Galón 5L"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && create()}
                      className="rounded-xl border-stone-200 focus:border-stone-400"
                    />
                  </div>
                  <div className="md:col-span-6 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Descripción
                    </label>
                    <Input
                      placeholder="Descripción opcional..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && create()}
                      className="rounded-xl border-stone-200 focus:border-stone-400"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button
                      onClick={create}
                      className="flex-1 bg-stone-900 hover:bg-stone-700 text-white rounded-xl"
                    >
                      <Check size={15} />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCreating(false)}
                      className="flex-1 rounded-xl border-stone-200"
                    >
                      <X size={15} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabla */}
      <Card className="border border-stone-100 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-7 w-7 animate-spin text-stone-300" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50 hover:bg-stone-50">
                  <TableHead className="w-[40px] pl-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    #
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Nombre
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Descripción
                  </TableHead>
                  <TableHead className="text-right pr-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formatos.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-32 text-center text-stone-400 text-sm italic"
                    >
                      No hay formatos registrados aún.
                    </TableCell>
                  </TableRow>
                ) : (
                  formatos.map((formato, i) => (
                    <TableRow
                      key={formato.id}
                      className="group border-stone-50 hover:bg-stone-50/60 transition-colors"
                    >
                      {editingId === formato.id ? (
                        <>
                          <TableCell className="pl-6 text-stone-300 text-sm">
                            {i + 1}
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="rounded-xl border-stone-200 h-9 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              className="rounded-xl border-stone-200 h-9 text-sm"
                            />
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => update(formato.id)}
                                className="bg-stone-900 hover:bg-stone-700 text-white rounded-lg h-8 px-3"
                              >
                                <Check size={13} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingId(null)}
                                className="rounded-lg h-8 px-3 text-stone-400"
                              >
                                <X size={13} />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="pl-6 text-stone-300 text-sm font-mono">
                            {i + 1}
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-stone-800">
                              {formato.name}
                            </span>
                          </TableCell>
                          <TableCell className="text-stone-400 text-sm italic">
                            {formato.description || (
                              <span className="text-stone-200 not-italic">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEdit(formato)}
                                className="h-8 w-8 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(formato.id)}
                                disabled={deletingId === formato.id}
                                className="h-8 w-8 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                              >
                                {deletingId === formato.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Trash2 size={14} />
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
    </div>
  );
}
