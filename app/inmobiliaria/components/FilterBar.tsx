"use client";

import { TipoInmueble, TIPO_LABELS } from "../data/propiedades";

export type Filtros = {
  search: string;
  operacion: "" | "venta" | "alquiler";
  tipo: "" | TipoInmueble;
  moneda: "" | "ARS" | "USD";
  precioMin: string;
  precioMax: string;
  ciudad: string;
};

export const FILTROS_INICIAL: Filtros = {
  search: "",
  operacion: "",
  tipo: "",
  moneda: "",
  precioMin: "",
  precioMax: "",
  ciudad: "",
};

const TIPOS: Array<{ value: "" | TipoInmueble; label: string }> = [
  { value: "", label: "Todos los tipos" },
  ...Object.entries(TIPO_LABELS).map(([v, l]) => ({
    value: v as TipoInmueble,
    label: l,
  })),
];

const CIUDADES = ["", "Córdoba", "Villa Carlos Paz", "La Calera", "Malagueño", "Río Ceballos"];

type Props = {
  filtros: Filtros;
  onChange: (f: Filtros) => void;
  total: number;
  filtrados: number;
};

export default function FilterBar({ filtros, onChange, total, filtrados }: Props) {
  const set = (partial: Partial<Filtros>) => onChange({ ...filtros, ...partial });

  const activeCount = Object.entries(filtros).filter(([, v]) => v !== "").length;
  const hasFilters = activeCount > 0;

  return (
    <div className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

        {/* Buscador */}
        <div className="relative mb-3">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            🔍
          </span>
          <input
            type="text"
            value={filtros.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Buscar por dirección, barrio o descripción..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {/* Operación */}
          <select
            value={filtros.operacion}
            onChange={(e) => set({ operacion: e.target.value as Filtros["operacion"] })}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Venta y Alquiler</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>

          {/* Tipo */}
          <select
            value={filtros.tipo}
            onChange={(e) => set({ tipo: e.target.value as Filtros["tipo"] })}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Moneda */}
          <select
            value={filtros.moneda}
            onChange={(e) => set({ moneda: e.target.value as Filtros["moneda"] })}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">$ y USD</option>
            <option value="ARS">Pesos ($)</option>
            <option value="USD">Dólares (USD)</option>
          </select>

          {/* Precio mínimo */}
          <input
            type="number"
            min={0}
            value={filtros.precioMin}
            onChange={(e) => set({ precioMin: e.target.value })}
            placeholder="Precio mínimo"
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />

          {/* Precio máximo */}
          <input
            type="number"
            min={0}
            value={filtros.precioMax}
            onChange={(e) => set({ precioMax: e.target.value })}
            placeholder="Precio máximo"
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />

          {/* Ciudad */}
          <select
            value={filtros.ciudad}
            onChange={(e) => set({ ciudad: e.target.value })}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            {CIUDADES.map((c) => (
              <option key={c} value={c}>
                {c || "Todas las ciudades"}
              </option>
            ))}
          </select>
        </div>

        {/* Resultados + limpiar */}
        <div className="mt-2.5 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-gray-800">{filtrados}</span> de {total}{" "}
            propiedades
            {hasFilters && (
              <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                {activeCount} filtro{activeCount > 1 ? "s" : ""} activo{activeCount > 1 ? "s" : ""}
              </span>
            )}
          </p>
          {hasFilters && (
            <button
              onClick={() => onChange(FILTROS_INICIAL)}
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              ✕ Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
