"use client";

import { useMemo, useState, useEffect } from "react";
import type { Propiedad } from "./data/propiedades";
import FilterBar, { Filtros, FILTROS_INICIAL } from "./components/FilterBar";
import PropertyCard from "./components/PropertyCard";

export default function InmobiliariaClient() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAL);

  useEffect(() => {
    fetch("/api/propiedades")
      .then((r) => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json();
      })
      .then((data: Propiedad[]) => setPropiedades(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtradas = useMemo(() => {
    const q = filtros.search.toLowerCase();
    return propiedades.filter((p) => {
      if (filtros.operacion && p.operacion !== filtros.operacion) return false;
      if (filtros.tipo && p.tipo !== filtros.tipo) return false;
      if (filtros.moneda && p.moneda !== filtros.moneda) return false;
      if (filtros.precioMin && p.precio < Number(filtros.precioMin)) return false;
      if (filtros.precioMax && p.precio > Number(filtros.precioMax)) return false;
      if (filtros.ciudad && p.ciudad !== filtros.ciudad) return false;
      if (q) {
        return (
          p.titulo.toLowerCase().includes(q) ||
          p.ubicacion.toLowerCase().includes(q) ||
          p.barrio.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [propiedades, filtros]);

  // ── Estado de carga ──
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-32 text-gray-400">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-500" />
        <p className="text-sm">Cargando propiedades…</p>
      </div>
    );
  }

  // ── Estado de error ──
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-32 text-center">
        <span className="text-5xl">⚠️</span>
        <p className="font-bold text-gray-700">No se pudieron cargar las propiedades</p>
        <p className="text-sm text-gray-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-400 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <FilterBar
        filtros={filtros}
        onChange={setFiltros}
        total={propiedades.length}
        filtrados={filtradas.length}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filtradas.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <span className="text-6xl">🏚️</span>
            <h3 className="text-xl font-bold text-gray-800">No encontramos propiedades</h3>
            <p className="max-w-xs text-sm text-gray-500">
              Probá ajustando los filtros o ampliando los criterios de búsqueda.
            </p>
            <button
              onClick={() => setFiltros(FILTROS_INICIAL)}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtradas.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
