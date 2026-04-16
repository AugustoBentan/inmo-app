import Link from "next/link";
import { Propiedad, formatPrecio, TIPO_LABELS } from "../../inmobiliaria/data/propiedades";

type Props = {
  propiedades: Propiedad[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
};

const OP_BADGE = {
  venta:    "bg-blue-100 text-blue-700",
  alquiler: "bg-emerald-100 text-emerald-700",
};

export default function PropertyTable({ propiedades, onEdit, onDelete, onCreate }: Props) {
  const ventas    = propiedades.filter((p) => p.operacion === "venta").length;
  const alquileres = propiedades.filter((p) => p.operacion === "alquiler").length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Encabezado */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Propiedades</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Gestioná el catálogo de propiedades del sitio.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <span>＋</span> Nueva propiedad
        </button>
      </div>

      {/* Tarjetas de stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: "Total",     value: propiedades.length, icon: "🏠", color: "text-gray-800" },
          { label: "En venta",  value: ventas,             icon: "💲", color: "text-blue-700" },
          { label: "Alquiler",  value: alquileres,         icon: "🔑", color: "text-emerald-700" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">{s.icon}</span>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{s.label}</p>
            </div>
            <p className={`mt-1 text-3xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-500">Propiedad</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Operación</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Tipo</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Precio</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Ciudad</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {propiedades.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/40 transition-colors">
                  {/* Foto + título */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-16 shrink-0 rounded-lg bg-gray-200 bg-cover bg-center"
                        style={{ backgroundImage: `url(${p.images[0]})` }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1 max-w-[200px]">
                          {p.titulo}
                        </p>
                        <p className="text-xs text-gray-400">{p.barrio}</p>
                      </div>
                    </div>
                  </td>

                  {/* Operación */}
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${OP_BADGE[p.operacion]}`}>
                      {p.operacion}
                    </span>
                  </td>

                  {/* Tipo */}
                  <td className="px-4 py-3 text-gray-600">{TIPO_LABELS[p.tipo]}</td>

                  {/* Precio */}
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {formatPrecio(p.precio, p.moneda)}
                  </td>

                  {/* Ciudad */}
                  <td className="px-4 py-3 text-gray-500">{p.ciudad}</td>

                  {/* Acciones */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/inmobiliaria/${p.id}`}
                        target="_blank"
                        title="Ver en sitio"
                        className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        👁️
                      </Link>
                      <button
                        onClick={() => onEdit(p.id)}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {propiedades.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-5xl">📭</span>
            <p className="font-bold text-gray-700">No hay propiedades cargadas</p>
            <p className="text-sm text-gray-400">Creá la primera usando el botón de arriba.</p>
          </div>
        )}
      </div>
    </main>
  );
}
