import Link from "next/link";
import Image from "next/image";
import { Propiedad, formatPrecio, TIPO_LABELS } from "../data/propiedades";

const OPERACION_STYLE = {
  venta: "bg-blue-600 text-white",
  alquiler: "bg-emerald-600 text-white",
};

export default function PropertyCard({ p }: { p: Propiedad }) {
  return (
    <Link
      href={`/inmobiliaria/${p.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={p.images[0]}
          alt={p.titulo}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${OPERACION_STYLE[p.operacion]}`}>
            {p.operacion}
          </span>
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-700 backdrop-blur-sm">
            {TIPO_LABELS[p.tipo]}
          </span>
        </div>

        {p.destacada && (
          <div className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
            ⭐ Destacada
          </div>
        )}

        {/* Precio encima de la imagen en mobile */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
          <p className="text-lg font-extrabold text-white drop-shadow">
            {formatPrecio(p.precio, p.moneda)}
          </p>
          {p.expensas && (
            <p className="text-[11px] text-white/80">
              + expensas $ {p.expensas.toLocaleString("es-AR")}
            </p>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-bold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors">
          {p.titulo}
        </h3>

        <p className="mb-3 flex items-center gap-1 text-xs text-gray-500">
          <span>📍</span>
          <span className="line-clamp-1">{p.barrio}, {p.ciudad}</span>
        </p>

        {/* Stats */}
        <div className="mt-auto flex items-center gap-3 border-t border-gray-100 pt-3 text-xs text-gray-600">
          {p.ambientes !== null && (
            <span className="flex items-center gap-1">
              <span>🏠</span>
              <span className="font-semibold">{p.ambientes}</span> amb.
            </span>
          )}
          {p.baños !== null && (
            <span className="flex items-center gap-1">
              <span>🚿</span>
              <span className="font-semibold">{p.baños}</span> baños
            </span>
          )}
          {p.superficieCubierta !== null && (
            <span className="flex items-center gap-1">
              <span>📐</span>
              <span className="font-semibold">{p.superficieCubierta}</span> m²
            </span>
          )}
          {p.superficieTotal !== null && p.superficieCubierta === null && (
            <span className="flex items-center gap-1">
              <span>📐</span>
              <span className="font-semibold">{p.superficieTotal}</span> m² tot.
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
