import Link from "next/link";
import type { Metadata } from "next";
import CotizadorSection from "./CotizadorSection";

export const metadata: Metadata = {
  title: "Seguros | Inmobiliaria & Seguros",
  description:
    "Cotizá tu seguro de Automotor, Caución, Hogar o ART. Recibí una propuesta personalizada por WhatsApp.",
};

export default function SegurosPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
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
        <div className="w-24" /> {/* spacer para centrar el logo */}
      </nav>

      {/* ── Hero ── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 px-4 py-20 text-white sm:px-6 lg:px-8">
        {/* Decoración de fondo */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-700/20 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-300">
            🛡️ Producción de Seguros
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Tu protección,<br />
            <span className="text-sky-400">sin complicaciones</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
            Asesoramiento personalizado y las mejores coberturas del mercado.
            En menos de 2 minutos tenés tu cotización por WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1.5">✅ Sin papeles</span>
            <span className="flex items-center gap-1.5">✅ Respuesta inmediata</span>
            <span className="flex items-center gap-1.5">✅ Asesoramiento gratuito</span>
          </div>
        </div>
      </header>

      {/* ── Cards de seguros + modal ── */}
      <CotizadorSection />

      {/* ── Footer mínimo ── */}
      <footer className="border-t border-gray-200 bg-white py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Inmobiliaria &amp; Seguros · Todos los derechos reservados
      </footer>
    </div>
  );
}
