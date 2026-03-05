"use client";

import { PRODUCTS } from "@/lib/products";
import { useState, useMemo } from "react";

export function useCatalogFilters() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [lineasActivas, setLineasActivas] = useState<string[]>([]);
  const [aromasActivos, setAromasActivos] = useState<string[]>([]);
  const [formatosActivos, setFormatosActivos] = useState<string[]>([]);
  const [soloBio, setSoloBio] = useState(false);
  const [soloConcentrado, setSoloConcentrado] = useState(false);
  const [ordenPrecio, setOrdenPrecio] = useState<"asc" | "desc" | null>(null);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const totalFiltros =
    lineasActivas.length +
    aromasActivos.length +
    formatosActivos.length +
    (soloBio ? 1 : 0) +
    (soloConcentrado ? 1 : 0) +
    (categoriaActiva !== "Todas" ? 1 : 0);

  const resetAll = () => {
    setCategoriaActiva("Todas");
    setLineasActivas([]);
    setAromasActivos([]);
    setFormatosActivos([]);
    setSoloBio(false);
    setSoloConcentrado(false);
    setOrdenPrecio(null);
  };

  const filtered = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      if (categoriaActiva !== "Todas" && p.categoria !== categoriaActiva)
        return false;
      if (lineasActivas.length > 0 && !lineasActivas.includes(p.linea))
        return false;
      if (aromasActivos.length > 0 && !aromasActivos.includes(p.aroma))
        return false;
      if (formatosActivos.length > 0 && !formatosActivos.includes(p.formato))
        return false;
      if (soloBio && !p.biodegradable) return false;
      if (soloConcentrado && !p.concentrado) return false;
      return true;
    });

    if (ordenPrecio === "asc")
      result = [...result].sort((a, b) => a.precio - b.precio);
    if (ordenPrecio === "desc")
      result = [...result].sort((a, b) => b.precio - a.precio);

    return result;
  }, [
    categoriaActiva,
    lineasActivas,
    aromasActivos,
    formatosActivos,
    soloBio,
    soloConcentrado,
    ordenPrecio,
  ]);

  return {
    categoriaActiva,
    setCategoriaActiva,
    lineasActivas,
    aromasActivos,
    formatosActivos,
    soloBio,
    soloConcentrado,
    ordenPrecio,
    totalFiltros,
    filtered,
    onReset: resetAll,
    onToggleLinea: (v: string) => toggle(lineasActivas, setLineasActivas, v),
    onToggleAroma: (v: string) => toggle(aromasActivos, setAromasActivos, v),
    onToggleFormato: (v: string) =>
      toggle(formatosActivos, setFormatosActivos, v),
    onToggleBio: () => setSoloBio((v) => !v),
    onToggleConcentrado: () => setSoloConcentrado((v) => !v),
    onToggleOrden: (v: "asc" | "desc") =>
      setOrdenPrecio((prev) => (prev === v ? null : v)),
  };
}
