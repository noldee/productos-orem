"use client";

import { X } from "lucide-react";
import { CheckFilter } from "@/components/ui/CheckFilter";
import { LINEAS, AROMAS, FORMATOS } from "@/lib/products";

interface FilterSidebarProps {
  lineasActivas: string[];
  aromasActivos: string[];
  formatosActivos: string[];
  soloBio: boolean;
  soloConcentrado: boolean;
  ordenPrecio: "asc" | "desc" | null;
  totalFiltros: number;
  onToggleLinea: (val: string) => void;
  onToggleAroma: (val: string) => void;
  onToggleFormato: (val: string) => void;
  onToggleBio: () => void;
  onToggleConcentrado: () => void;
  onToggleOrden: (val: "asc" | "desc") => void;
  onReset: () => void;
}

export function FilterSidebar({
  lineasActivas,
  aromasActivos,
  formatosActivos,
  soloBio,
  soloConcentrado,
  ordenPrecio,
  totalFiltros,
  onToggleLinea,
  onToggleAroma,
  onToggleFormato,
  onToggleBio,
  onToggleConcentrado,
  onToggleOrden,
  onReset,
}: FilterSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Línea */}
      <div>
        <h4 className="sans text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">
          Línea
        </h4>
        <div className="space-y-3">
          {LINEAS.map((l) => (
            <CheckFilter
              key={l}
              label={l}
              checked={lineasActivas.includes(l)}
              onChange={() => onToggleLinea(l)}
            />
          ))}
        </div>
      </div>

      {/* Aroma */}
      <div>
        <h4 className="sans text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">
          Aroma
        </h4>
        <div className="space-y-3">
          {AROMAS.map((a) => (
            <CheckFilter
              key={a}
              label={a}
              checked={aromasActivos.includes(a)}
              onChange={() => onToggleAroma(a)}
            />
          ))}
        </div>
      </div>

      {/* Formato */}
      <div>
        <h4 className="sans text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">
          Formato
        </h4>
        <div className="space-y-3">
          {FORMATOS.map((f) => (
            <CheckFilter
              key={f}
              label={f}
              checked={formatosActivos.includes(f)}
              onChange={() => onToggleFormato(f)}
            />
          ))}
        </div>
      </div>

      {/* Atributos */}
      <div>
        <h4 className="sans text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">
          Atributos
        </h4>
        <div className="space-y-3">
          <CheckFilter
            label="Solo Biodegradable"
            checked={soloBio}
            onChange={onToggleBio}
          />
          <CheckFilter
            label="Solo Concentrado"
            checked={soloConcentrado}
            onChange={onToggleConcentrado}
          />
        </div>
      </div>

      {/* Precio */}
      <div>
        <h4 className="sans text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4">
          Ordenar por precio
        </h4>
        <div className="space-y-3">
          <CheckFilter
            label="Menor a mayor"
            checked={ordenPrecio === "asc"}
            onChange={() => onToggleOrden("asc")}
          />
          <CheckFilter
            label="Mayor a menor"
            checked={ordenPrecio === "desc"}
            onChange={() => onToggleOrden("desc")}
          />
        </div>
      </div>

      {totalFiltros > 0 && (
        <button
          onClick={onReset}
          className="w-full py-3 rounded-xl border border-stone-200 sans text-[10px] uppercase tracking-widest text-stone-500 hover:border-red-300 hover:text-red-500 transition-all"
        >
          Limpiar filtros ({totalFiltros})
        </button>
      )}
    </div>
  );
}
