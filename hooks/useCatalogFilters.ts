"use client";

import { useState, useMemo, useEffect } from "react";
import { api } from "@/lib/api";

export interface Product {
  id: number;
  name: string;
  desc: string;
  precio: number;
  img: string;
  badge: string | null;
  biodegradable: boolean;
  concentrado: boolean;
  active: boolean;
  category: { id: number; name: string };
  linea: { id: number; name: string };
  aroma: { id: number; name: string };
  formato: { id: number; name: string };
}

interface SelectOption {
  id: number;
  name: string;
}

export function useCatalogFilters() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [lineas, setLineas] = useState<SelectOption[]>([]);
  const [aromas, setAromas] = useState<SelectOption[]>([]);
  const [formatos, setFormatos] = useState<SelectOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [lineasActivas, setLineasActivas] = useState<string[]>([]);
  const [aromasActivos, setAromasActivos] = useState<string[]>([]);
  const [formatosActivos, setFormatosActivos] = useState<string[]>([]);
  const [soloBio, setSoloBio] = useState(false);
  const [soloConcentrado, setSoloConcentrado] = useState(false);
  const [ordenPrecio, setOrdenPrecio] = useState<"asc" | "desc" | null>(null);

  useEffect(() => {
    Promise.all([
      api.get("/products"),
      api.get("/categories"),
      api.get("/lineas"),
      api.get("/aromas"),
      api.get("/formatos"),
    ])
      .then(([p, c, l, a, f]) => {
        setProducts(p.data);
        setCategories(c.data);
        setLineas(l.data);
        setAromas(a.data);
        setFormatos(f.data);
      })
      .finally(() => setLoadingData(false));
  }, []);

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
    let result = products.filter((p) => {
      if (categoriaActiva !== "Todas" && p.category.name !== categoriaActiva)
        return false;
      if (lineasActivas.length > 0 && !lineasActivas.includes(p.linea.name))
        return false;
      if (aromasActivos.length > 0 && !aromasActivos.includes(p.aroma.name))
        return false;
      if (
        formatosActivos.length > 0 &&
        !formatosActivos.includes(p.formato.name)
      )
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
    products,
    categoriaActiva,
    lineasActivas,
    aromasActivos,
    formatosActivos,
    soloBio,
    soloConcentrado,
    ordenPrecio,
  ]);

  // Categorías dinámicas incluyendo "Todas"
  const categoriasDisponibles = ["Todas", ...categories.map((c) => c.name)];

  return {
    // Data
    loadingData,
    categories,
    lineas,
    aromas,
    formatos,
    categoriasDisponibles,
    // Filtros
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
