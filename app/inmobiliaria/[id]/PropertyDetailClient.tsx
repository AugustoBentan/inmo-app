"use client";

import Link from "next/link";
import { Propiedad, formatPrecio, TIPO_LABELS } from "../data/propiedades";
import ImageCarousel from "../components/ImageCarousel";

// TODO: Reemplazar con el número de WhatsApp de la empresa
const WA_NUMBER = "5491100000000";

const OPERACION_COLOR = {
  venta: "bg-blue-100 text-blue-700",
  alquiler: "bg-emerald-100 text-emerald-700",
};

export default function PropertyDetailClient({ p }: { p: Propiedad }) {
  const waMessage = encodeURIComponent(
    [
      `Hola! Me interesa la siguiente propiedad 👋`,
      ``,
      `🏠 *${p.titulo}*`,
      `📍 ${p.ubicacion}`,
      `💰 ${formatPrecio(p.precio, p.moneda)}`,
      `🔑 ${TIPO_LABELS[p.tipo]} en ${p.operacion}`,
      ``,
      `¿Podría obtener más información? ¡Muchas gracias!`,
    ].join("\n")
  );
  const waLink = `https://wa.me/${WA_NUMBER}?text=${waMessage}`;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-slate-900/95 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <Link
          href="/inmobiliaria"
          className="flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
        >
          <span>←</span>
          <span>Volver al catálogo</span>
        </Link>
        <span className="hidden text-sm font-bold tracking-wide text-white sm:block">
          Inmobiliaria &amp; Seguros
        </span>
        <div className="w-28" />
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

          {/* ── Columna principal ── */}
          <div className="flex-1 min-w-0">
            {/* Carrusel */}
            <ImageCarousel images={p.images} title={p.titulo} />

            {/* Título y badges */}
            <div className="mt-6">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${OPERACION_COLOR[p.operacion]}`}>
                  {p.operacion}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-600">
                  {TIPO_LABELS[p.tipo]}
                </span>
                {p.destacada && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    ⭐ Destacada
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{p.titulo}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-gray-500">
                <span>📍</span>
                <span>{p.ubicacion}</span>
              </p>
            </div>

            {/* Stats rápidos */}
            <div className="mt-5 flex flex-wrap gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              {p.ambientes !== null && (
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-2xl">🏠</span>
                  <span className="text-lg font-extrabold text-gray-900">{p.ambientes}</span>
                  <span className="text-xs text-gray-500">Ambientes</span>
                </div>
              )}
              {p.dormitorios !== null && p.dormitorios > 0 && (
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-2xl">🛏️</span>
                  <span className="text-lg font-extrabold text-gray-900">{p.dormitorios}</span>
                  <span className="text-xs text-gray-500">Dormitorios</span>
                </div>
              )}
              {p.baños !== null && (
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-2xl">🚿</span>
                  <span className="text-lg font-extrabold text-gray-900">{p.baños}</span>
                  <span className="text-xs text-gray-500">Baños</span>
                </div>
              )}
              {p.superficieCubierta !== null && (
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-2xl">📐</span>
                  <span className="text-lg font-extrabold text-gray-900">{p.superficieCubierta}</span>
                  <span className="text-xs text-gray-500">m² cubiertos</span>
                </div>
              )}
              {p.superficieTotal !== null && (
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-2xl">🗺️</span>
                  <span className="text-lg font-extrabold text-gray-900">{p.superficieTotal}</span>
                  <span className="text-xs text-gray-500">m² totales</span>
                </div>
              )}
            </div>

            {/* Descripción */}
            <section className="mt-6">
              <h2 className="mb-3 text-lg font-extrabold text-gray-900">Descripción</h2>
              <p className="leading-relaxed text-gray-600">{p.descripcion}</p>
            </section>

            {/* Características */}
            {p.caracteristicas.length > 0 && (
              <section className="mt-6">
                <h2 className="mb-3 text-lg font-extrabold text-gray-900">Características</h2>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {p.caracteristicas.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-0.5 font-bold text-blue-500">✓</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Servicios */}
            {p.servicios.length > 0 && (
              <section className="mt-6">
                <h2 className="mb-3 text-lg font-extrabold text-gray-900">Servicios</h2>
                <div className="flex flex-wrap gap-2">
                  {p.servicios.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Requisitos */}
            {p.requisitos.length > 0 && (
              <section className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5">
                <h2 className="mb-3 text-lg font-extrabold text-amber-800">
                  📋 Requisitos para alquilar
                </h2>
                <ul className="flex flex-col gap-2">
                  {p.requisitos.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm text-amber-900">
                      <span className="mt-0.5">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Spacer para que el botón flotante no tape el contenido en mobile */}
            <div className="h-24 lg:hidden" />
          </div>

          {/* ── Sidebar (solo desktop) ── */}
          <aside className="hidden shrink-0 lg:sticky lg:top-24 lg:flex lg:w-80 lg:flex-col lg:gap-4">
            {/* Precio */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Precio
              </p>
              <p className="text-3xl font-extrabold text-gray-900">
                {formatPrecio(p.precio, p.moneda)}
              </p>
              {p.expensas && (
                <p className="mt-1 text-sm text-gray-500">
                  + Expensas $ {p.expensas.toLocaleString("es-AR")}/mes
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-green-500 hover:shadow-green-500/30"
                >
                  <span>📲</span>
                  Consultar por WhatsApp
                </a>
                <a
                  href={`tel:+${WA_NUMBER}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
                >
                  <span>📞</span>
                  Llamar ahora
                </a>
              </div>
            </div>

            {/* Info adicional */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-sm text-gray-600">
              <p className="font-semibold text-gray-800 mb-2">🏢 Sobre la propiedad</p>
              <div className="flex flex-col gap-1.5">
                <span><strong>Ciudad:</strong> {p.ciudad}</span>
                <span><strong>Barrio:</strong> {p.barrio}</span>
                <span><strong>Operación:</strong> {p.operacion.charAt(0).toUpperCase() + p.operacion.slice(1)}</span>
                <span><strong>Tipo:</strong> {TIPO_LABELS[p.tipo]}</span>
                {p.superficieTotal && <span><strong>Sup. total:</strong> {p.superficieTotal} m²</span>}
                {p.superficieCubierta && <span><strong>Sup. cubierta:</strong> {p.superficieCubierta} m²</span>}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Botón flotante WhatsApp (mobile) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 p-4 backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex max-w-sm flex-col gap-2">
          <p className="text-center text-xs text-gray-500">
            <span className="font-bold text-gray-800">{formatPrecio(p.precio, p.moneda)}</span>
            {p.expensas ? ` + exp. $${p.expensas.toLocaleString("es-AR")}` : ""}
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-green-500 active:scale-95"
          >
            <span>📲</span>
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
