"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Configuración ────────────────────────────────────────────────────────────
// TODO: Reemplazar con el número de WhatsApp de la empresa (formato: código país + número sin espacios)
// Ejemplo Argentina: "5491112345678"
const WA_NUMBER = "5491100000000";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Field = { id: string; label: string; placeholder: string; type?: string };

type SeguroConfig = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  features: string[];
  fields: Field[];
  color: {
    border: string;
    iconBg: string;
    iconText: string;
    badge: string;
    badgeText: string;
    button: string;
    buttonHover: string;
    modalHeader: string;
  };
};

// ─── Datos de seguros ─────────────────────────────────────────────────────────
const SEGUROS: SeguroConfig[] = [
  {
    id: "automotor",
    title: "Automotor",
    emoji: "🚗",
    description:
      "Cobertura completa para tu vehículo. Desde responsabilidad civil hasta todo riesgo con asistencia en ruta.",
    features: [
      "Responsabilidad civil obligatoria",
      "Todo riesgo con franquicia",
      "Asistencia mecánica 24 hs",
    ],
    fields: [
      { id: "vehiculo", label: "Marca, modelo y año del vehículo", placeholder: "Ej: Toyota Corolla 2021" },
      { id: "valor", label: "Valor estimado del vehículo", placeholder: "Ej: $8.000.000" },
    ],
    color: {
      border: "border-sky-500",
      iconBg: "bg-sky-100",
      iconText: "text-sky-600",
      badge: "bg-sky-50",
      badgeText: "text-sky-700",
      button: "bg-sky-600",
      buttonHover: "hover:bg-sky-500",
      modalHeader: "from-sky-700 to-sky-500",
    },
  },
  {
    id: "caucion",
    title: "Caución",
    emoji: "📋",
    description:
      "Garantías para contratos de alquiler, obras y licitaciones. Respaldá tus compromisos ante terceros.",
    features: [
      "Garantía de alquiler",
      "Caución por obras y contratos",
      "Licitaciones públicas y privadas",
    ],
    fields: [
      { id: "tipo", label: "Tipo de caución requerida", placeholder: "Ej: Garantía de alquiler" },
      { id: "monto", label: "Monto a garantizar", placeholder: "Ej: $2.000.000" },
    ],
    color: {
      border: "border-violet-500",
      iconBg: "bg-violet-100",
      iconText: "text-violet-600",
      badge: "bg-violet-50",
      badgeText: "text-violet-700",
      button: "bg-violet-600",
      buttonHover: "hover:bg-violet-500",
      modalHeader: "from-violet-700 to-violet-500",
    },
  },
  {
    id: "hogar",
    title: "Hogar",
    emoji: "🏠",
    description:
      "Protección integral para tu vivienda: incendio, robo, daños al contenido y responsabilidad civil.",
    features: [
      "Incendio y daños por agua",
      "Robo y daño al contenido",
      "Responsabilidad civil del hogar",
    ],
    fields: [
      { id: "inmueble", label: "Tipo y ubicación del inmueble", placeholder: "Ej: Casa en Córdoba Capital" },
      { id: "valor", label: "Valor estimado de la propiedad", placeholder: "Ej: $30.000.000" },
    ],
    color: {
      border: "border-amber-500",
      iconBg: "bg-amber-100",
      iconText: "text-amber-600",
      badge: "bg-amber-50",
      badgeText: "text-amber-700",
      button: "bg-amber-600",
      buttonHover: "hover:bg-amber-500",
      modalHeader: "from-amber-700 to-amber-500",
    },
  },
  {
    id: "art",
    title: "ART",
    emoji: "👷",
    description:
      "Aseguradora de Riesgos del Trabajo. Cumplí con la obligación legal y protegé a tu equipo.",
    features: [
      "Cobertura de accidentes laborales",
      "Enfermedades profesionales",
      "Prestaciones médicas y económicas",
    ],
    fields: [
      { id: "empresa", label: "Nombre de la empresa y actividad", placeholder: "Ej: Constructora ABC – Construcción" },
      { id: "empleados", label: "Cantidad de empleados", placeholder: "Ej: 12 empleados" },
    ],
    color: {
      border: "border-emerald-500",
      iconBg: "bg-emerald-100",
      iconText: "text-emerald-600",
      badge: "bg-emerald-50",
      badgeText: "text-emerald-700",
      button: "bg-emerald-600",
      buttonHover: "hover:bg-emerald-500",
      modalHeader: "from-emerald-700 to-emerald-500",
    },
  },
];

// ─── Modal ────────────────────────────────────────────────────────────────────
function CotizacionModal({
  seguro,
  onClose,
}: {
  seguro: SeguroConfig;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Record<string, string>>({
    nombre: "",
    telefono: "",
    ...Object.fromEntries(seguro.fields.map((f) => [f.id, ""])),
  });
  const [submitted, setSubmitted] = useState(false);

  // Cerrar con Escape
  const handleEsc = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  const allFilled = Object.values(form).every((v) => v.trim() !== "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allFilled) return;

    // Armar mensaje para WhatsApp
    const lines = [
      `Hola! Quiero solicitar una cotización de seguro 👋`,
      ``,
      `📋 *Tipo de seguro:* ${seguro.title}`,
      `👤 *Nombre:* ${form.nombre}`,
      `📱 *Teléfono:* ${form.telefono}`,
      ...seguro.fields.map(
        (f) => `🔹 *${f.label}:* ${form[f.id]}`
      ),
      ``,
      `Quedo a la espera de su respuesta, ¡muchas gracias!`,
    ];

    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, "_blank");
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con gradiente */}
        <div className={`bg-gradient-to-r ${seguro.color.modalHeader} px-6 py-5 text-white`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{seguro.emoji}</span>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest opacity-80">
                Cotización
              </p>
              <h3 className="text-xl font-extrabold">Seguro {seguro.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span className="text-5xl">✅</span>
              <p className="text-lg font-bold text-gray-800">¡WhatsApp abierto!</p>
              <p className="text-sm text-gray-500">
                Tu mensaje ya está listo para enviar. Revisá la ventana de WhatsApp.
              </p>
              <button
                onClick={onClose}
                className="mt-2 rounded-xl bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Campos comunes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Teléfono de contacto *
                </label>
                <input
                  type="tel"
                  required
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  placeholder="Ej: 351-4123456"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Campos específicos del seguro */}
              {seguro.fields.map((field) => (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {field.label} *
                  </label>
                  <input
                    type={field.type ?? "text"}
                    required
                    value={form[field.id]}
                    onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                    placeholder={field.placeholder}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              ))}

              {/* Submit */}
              <button
                type="submit"
                disabled={!allFilled}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-green-500 hover:shadow-green-500/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>📲</span>
                Solicitar Cotización por WhatsApp
              </button>
              <p className="text-center text-[11px] text-gray-400">
                Se abrirá WhatsApp con el mensaje listo para enviar.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tarjeta de seguro ────────────────────────────────────────────────────────
function SeguroCard({
  seguro,
  onCotizar,
}: {
  seguro: SeguroConfig;
  onCotizar: (s: SeguroConfig) => void;
}) {
  const c = seguro.color;
  return (
    <article
      className={`flex flex-col rounded-2xl border-t-4 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl ${c.border}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl ${c.iconBg}`}>
          {seguro.emoji}
        </div>
        <h3 className="text-xl font-extrabold text-gray-900">
          Seguro {seguro.title}
        </h3>
      </div>

      <p className="mb-5 text-sm leading-relaxed text-gray-500">
        {seguro.description}
      </p>

      <ul className="mb-6 flex flex-col gap-2">
        {seguro.features.map((feat) => (
          <li key={feat} className="flex items-start gap-2 text-sm text-gray-600">
            <span className={`mt-0.5 text-xs font-bold ${c.iconText}`}>✓</span>
            {feat}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onCotizar(seguro)}
        className={`mt-auto w-full rounded-xl py-3 text-sm font-bold text-white transition-all duration-200 ${c.button} ${c.buttonHover} hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2`}
      >
        Cotizar ahora →
      </button>
    </article>
  );
}

// ─── Sección principal (export) ───────────────────────────────────────────────
export default function CotizadorSection() {
  const [selected, setSelected] = useState<SeguroConfig | null>(null);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <span className="mb-3 inline-block rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Nuestros productos
        </span>
        <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
          Elegí el seguro que necesitás
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-gray-500">
          Completá el formulario y recibís una cotización personalizada directamente por WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {SEGUROS.map((s) => (
          <SeguroCard key={s.id} seguro={s} onCotizar={setSelected} />
        ))}
      </div>

      {selected && (
        <CotizacionModal seguro={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
