import Link from "next/link";
import type { Metadata } from "next";
import InmobiliariaClient from "./InmobiliariaClient";

export const metadata: Metadata = {
  title: "Propiedades | Inmobiliaria & Seguros",
  description:
    "Catálogo de propiedades en venta y alquiler: casas, departamentos, PH, lotes y locales en Córdoba y alrededores.",
};

export default function InmobiliariaPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-slate-900/95 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
        >
          <span>←</span>
          <span>Volver al inicio</span>
        </Link>
        <span className="text-sm font-bold tracking-wide text-white">
          Inmobiliaria &amp; Seguros
        </span>
        <div className="w-28" />
      </nav>

      {/* Hero compacto */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-52 w-52 rounded-full bg-orange-700/20 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300">
            🏡 Catálogo de Propiedades
          </span>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Encontrá tu lugar ideal
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/70">
            Casas, departamentos, PH, lotes y locales en venta y alquiler en Córdoba y sierras.
          </p>
        </div>
      </header>

      {/* Filtros + grid */}
      <InmobiliariaClient />

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Inmobiliaria &amp; Seguros · Todos los derechos reservados
      </footer>
    </div>
  );
}
