"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Propiedad,
  TipoInmueble,
  TIPO_LABELS,
} from "../../inmobiliaria/data/propiedades";
import { createBrowserClient } from "@/lib/supabase/client";

const MapaSelectorUbicacion = dynamic(
  () => import("@/components/MapaSelectorUbicacion"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-2xl bg-gray-100">
        <p className="text-sm text-gray-400">Cargando mapa…</p>
      </div>
    ),
  }
);

const STORAGE_BUCKET = "propiedades";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type FormData = {
  titulo: string;
  operacion: "venta" | "alquiler" | "";
  tipo: TipoInmueble | "";
  precio: string;
  moneda: "ARS" | "USD";
  ubicacion: string;
  barrio: string;
  ciudad: string;
  ambientes: string;
  dormitorios: string;
  baños: string;
  cocheras: string;
  superficieCubierta: string;
  superficieTotal: string;
  expensas: string;
  descripcion: string;
  caracteristicas: string[];
  servicios: string[];
  requisitos: string[];
  destacada: boolean;
  lat: number | null;
  lng: number | null;
};

const FORM_INICIAL: FormData = {
  titulo: "", operacion: "", tipo: "", precio: "", moneda: "USD",
  ubicacion: "", barrio: "", ciudad: "",
  ambientes: "", dormitorios: "", baños: "", cocheras: "",
  superficieCubierta: "", superficieTotal: "", expensas: "",
  descripcion: "", caracteristicas: [], servicios: [], requisitos: [],
  destacada: false,
  lat: null, lng: null,
};

const SERVICIOS_COMUNES = [
  "Agua corriente", "Gas natural", "Electricidad", "Cloacas",
  "Internet fibra óptica", "Seguridad 24hs", "Aire acondicionado central",
  "Electricidad trifásica",
];

// ─── UI helpers ───────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <legend className="mb-4 -mt-2 flex items-center gap-2 px-1">
        <span className="text-base font-extrabold text-gray-800">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500" data-error>{error}</p>}
    </div>
  );
}

const INPUT_CLS =
  "rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100";
const SELECT_CLS =
  "rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer";

// ─── Lista dinámica ───────────────────────────────────────────────────────────
function DynamicList({ label, placeholder, items, onChange }: {
  label: string; placeholder: string; items: string[]; onChange: (items: string[]) => void;
}) {
  const add    = () => onChange([...items, ""]);
  const update = (i: number, val: string) => { const n = [...items]; n[i] = val; onChange(n); };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text" value={item} onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder} className={`${INPUT_CLS} flex-1`}
          />
          <button
            type="button" onClick={() => remove(i)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
          >✕</button>
        </div>
      ))}
      <button
        type="button" onClick={add}
        className="self-start rounded-xl border border-dashed border-blue-300 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
      >+ Agregar {label.toLowerCase()}</button>
    </div>
  );
}

// ─── Carga de imágenes (preview local, sin subir aún) ─────────────────────────
function ImageUpload({
  previews,
  pendingCount,
  onAdd,
  onRemove,
  disabled,
}: {
  previews: string[];
  pendingCount: number;
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFiles = useCallback(
    (files: FileList | null) => {
      if (!files || disabled) return;
      onAdd(Array.from(files).filter((f) => f.type.startsWith("image/")));
    },
    [onAdd, disabled]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-10 transition-colors ${
          disabled ? "cursor-not-allowed opacity-50 border-gray-200 bg-gray-50"
          : dragging ? "border-blue-400 bg-blue-50"
          : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50"
        }`}
      >
        <span className="text-xl">📸</span>
        <p className="text-sm font-semibold text-gray-600">
          Arrastrá imágenes o <span className="text-blue-600 underline">hacé clic para subir</span>
        </p>
        <p className="text-xs text-gray-400">PNG, JPG, WEBP — múltiples archivos permitidos</p>
        <input
          ref={fileInputRef} type="file" accept="image/*" multiple
          className="hidden" onChange={(e) => processFiles(e.target.files)}
        />
      </div>

      {/* Aviso de imágenes pendientes */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5">
          <span className="text-amber-600">⏳</span>
          <p className="text-xs font-semibold text-amber-700">
            {pendingCount} imagen{pendingCount > 1 ? "es" : ""} lista{pendingCount > 1 ? "s" : ""} para subir — se subirán al guardar la propiedad
          </p>
        </div>
      )}

      {/* Grilla de previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {previews.map((src, i) => {
            const isPending = src.startsWith("blob:");
            return (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Vista previa ${i + 1}`} className="h-full w-full object-cover" />

                {/* Badge: pendiente vs subida */}
                <span className={`absolute right-1 top-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white ${
                  isPending ? "bg-amber-500" : "bg-emerald-600"
                }`}>
                  {isPending ? "Local" : "✓"}
                </span>

                {i === 0 && (
                  <span className="absolute bottom-1 left-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    Portada
                  </span>
                )}

                {!disabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
                    <button
                      type="button" onClick={() => onRemove(i)}
                      className="scale-75 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
                    >Quitar</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Barra de progreso de subida ──────────────────────────────────────────────
function UploadProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs font-semibold text-blue-700">
        <span>Subiendo imágenes… {current}/{total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-blue-100">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Formulario principal ─────────────────────────────────────────────────────
type Props = {
  propiedad: Propiedad | null;
  saving?: boolean;
  resetSignal?: number;
  onSave: (p: Propiedad) => void;
  onCancel: () => void;
};

export default function PropertyForm({
  propiedad,
  saving = false,
  resetSignal = 0,
  onSave,
  onCancel,
}: Props) {
  const [form, setForm] = useState<FormData>(FORM_INICIAL);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(new Map());
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // ── Poblar al editar ──
  useEffect(() => {
    if (propiedad) {
      setForm({
        titulo: propiedad.titulo,
        operacion: propiedad.operacion,
        tipo: propiedad.tipo,
        precio: String(propiedad.precio),
        moneda: propiedad.moneda,
        ubicacion: propiedad.ubicacion,
        barrio: propiedad.barrio,
        ciudad: propiedad.ciudad,
        ambientes:          propiedad.ambientes          != null ? String(propiedad.ambientes)          : "",
        dormitorios:        propiedad.dormitorios        != null ? String(propiedad.dormitorios)        : "",
        baños:              propiedad.baños              != null ? String(propiedad.baños)              : "",
        cocheras:           propiedad.cocheras           != null ? String(propiedad.cocheras)           : "",
        superficieCubierta: propiedad.superficieCubierta != null ? String(propiedad.superficieCubierta) : "",
        superficieTotal:    propiedad.superficieTotal    != null ? String(propiedad.superficieTotal)    : "",
        expensas:           propiedad.expensas           != null ? String(propiedad.expensas)           : "",
        descripcion: propiedad.descripcion,
        caracteristicas: [...propiedad.caracteristicas],
        servicios: [...propiedad.servicios],
        requisitos: [...propiedad.requisitos],
        destacada: propiedad.destacada,
        lat: propiedad.lat ?? null,
        lng: propiedad.lng ?? null,
      });
      setImagePreviews([...propiedad.images]);
      setPendingFiles(new Map());
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propiedad]);

  // ── Limpiar al recibir señal de reset (después de crear exitosamente) ──
  useEffect(() => {
    if (resetSignal > 0) resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  function resetForm() {
    // Revocar blob URLs para liberar memoria
    setPendingFiles((prev) => { prev.forEach((_, url) => URL.revokeObjectURL(url)); return new Map(); });
    setForm(FORM_INICIAL);
    setImagePreviews([]);
    setErrors({});
    setUploadProgress(null);
  }

  const set = (partial: Partial<FormData>) => setForm((prev) => ({ ...prev, ...partial }));

  // ── Agregar imágenes: solo preview local, NO sube aún ──
  const handleAddImages = useCallback((files: File[]) => {
    const newUrls: string[] = [];
    const newMap = new Map(pendingFiles);
    for (const file of files) {
      const blobUrl = URL.createObjectURL(file);
      newUrls.push(blobUrl);
      newMap.set(blobUrl, file);
    }
    setImagePreviews((prev) => [...prev, ...newUrls]);
    setPendingFiles(newMap);
  }, [pendingFiles]);

  const handleRemoveImage = (index: number) => {
    const url = imagePreviews[index];
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
      setPendingFiles((prev) => { const m = new Map(prev); m.delete(url); return m; });
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Subir archivos pendientes a Supabase en el momento del submit ──
  const uploadPendingImages = async (): Promise<string[]> => {
    const result: string[] = [];
    const pending = imagePreviews.filter((u) => u.startsWith("blob:"));
    if (pending.length === 0) {
      return imagePreviews; // todas ya están subidas (modo edición)
    }

    const supabase = createBrowserClient();
    let current = 0;
    setUploadProgress({ current: 0, total: pending.length });

    for (const url of imagePreviews) {
      if (!url.startsWith("blob:")) {
        result.push(url); // URL ya subida (edición)
        continue;
      }
      const file = pendingFiles.get(url);
      if (!file) continue;

      current++;
      setUploadProgress({ current, total: pending.length });

      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (error) {
        console.error("Error subiendo imagen:", error.message);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(data.path);

      result.push(publicUrl);
      URL.revokeObjectURL(url); // liberar memoria
    }

    setUploadProgress(null);
    return result;
  };

  // ── Validación ──
  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.titulo.trim())        errs.titulo      = "El título es obligatorio";
    if (!form.operacion)            errs.operacion   = "Seleccioná una operación";
    if (!form.tipo)                 errs.tipo        = "Seleccioná un tipo";
    if (!form.precio || isNaN(Number(form.precio))) errs.precio = "Ingresá un precio válido";
    if (!form.ubicacion.trim())     errs.ubicacion   = "La dirección es obligatoria";
    if (!form.ciudad.trim())        errs.ciudad      = "La ciudad es obligatoria";
    if (!form.descripcion.trim())   errs.descripcion = "La descripción es obligatoria";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const num = (v: string): number | null => (v.trim() === "" ? null : Number(v));

  // ── Submit: primero sube imágenes, luego llama onSave ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setUploading(true);
    let finalImages: string[];
    try {
      finalImages = await uploadPendingImages();
    } finally {
      setUploading(false);
    }

    const saved: Propiedad = {
      id: propiedad?.id ?? "",
      titulo: form.titulo.trim(),
      operacion: form.operacion as "venta" | "alquiler",
      tipo: form.tipo as TipoInmueble,
      precio: Number(form.precio),
      moneda: form.moneda,
      ubicacion: form.ubicacion.trim(),
      barrio: form.barrio.trim(),
      ciudad: form.ciudad.trim(),
      ambientes:          num(form.ambientes),
      dormitorios:        num(form.dormitorios),
      baños:              num(form.baños),
      cocheras:           num(form.cocheras),
      superficieCubierta: num(form.superficieCubierta),
      superficieTotal:    num(form.superficieTotal),
      expensas:           num(form.expensas),
      descripcion: form.descripcion.trim(),
      caracteristicas: form.caracteristicas.filter(Boolean),
      servicios: form.servicios,
      requisitos: form.requisitos.filter(Boolean),
      destacada: form.destacada,
      images: finalImages.length > 0
        ? finalImages
        : ["https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80"],
      lat: form.lat,
      lng: form.lng,
    };

    onSave(saved);
  };

  const isBusy = uploading || saving;
  const isEdit = Boolean(propiedad);
  const pendingCount = pendingFiles.size;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {isEdit ? "Editar propiedad" : "Nueva propiedad"}
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {isEdit
              ? `Modificando: ${propiedad?.titulo}`
              : "Completá los campos para publicar la propiedad."}
          </p>
        </div>
        <button
          type="button" onClick={onCancel}
          className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← Volver al listado
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

        {/* 1. Información básica */}
        <Section title="📋 Información básica">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Título de la publicación" required error={errors.titulo}>
              <input
                type="text" value={form.titulo}
                onChange={(e) => set({ titulo: e.target.value })}
                placeholder="Ej: Casa moderna con jardín y piscina"
                className={INPUT_CLS}
              />
            </Field>

            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <input
                type="checkbox" id="destacada" checked={form.destacada}
                onChange={(e) => set({ destacada: e.target.checked })}
                className="h-4 w-4 rounded accent-amber-500"
              />
              <label htmlFor="destacada" className="cursor-pointer text-sm font-semibold text-amber-800">
                ⭐ Marcar como propiedad destacada
              </label>
            </div>

            <Field label="Tipo de operación" required error={errors.operacion}>
              <select
                value={form.operacion}
                onChange={(e) => set({ operacion: e.target.value as FormData["operacion"] })}
                className={SELECT_CLS}
              >
                <option value="">Seleccioná una operación</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </Field>

            <Field label="Tipo de inmueble" required error={errors.tipo}>
              <select
                value={form.tipo}
                onChange={(e) => set({ tipo: e.target.value as TipoInmueble | "" })}
                className={SELECT_CLS}
              >
                <option value="">Seleccioná un tipo</option>
                {Object.entries(TIPO_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        {/* 2. Precio */}
        <Section title="💰 Precio y financiero">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Moneda">
              <select value={form.moneda} onChange={(e) => set({ moneda: e.target.value as "ARS" | "USD" })} className={SELECT_CLS}>
                <option value="USD">Dólares (USD)</option>
                <option value="ARS">Pesos argentinos ($)</option>
              </select>
            </Field>
            <Field label="Precio" required error={errors.precio}>
              <input type="number" min={0} value={form.precio} onChange={(e) => set({ precio: e.target.value })} placeholder="Ej: 285000" className={INPUT_CLS} />
            </Field>
            <Field label="Expensas mensuales ($)">
              <input type="number" min={0} value={form.expensas} onChange={(e) => set({ expensas: e.target.value })} placeholder="Ej: 45000 (opcional)" className={INPUT_CLS} />
            </Field>
          </div>
        </Section>

        {/* 3. Ubicación */}
        <Section title="📍 Ubicación">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Dirección completa" required error={errors.ubicacion}>
              <input type="text" value={form.ubicacion} onChange={(e) => set({ ubicacion: e.target.value })} placeholder="Ej: Av. Rafael Núñez 4230" className={INPUT_CLS} />
            </Field>
            <Field label="Barrio">
              <input type="text" value={form.barrio} onChange={(e) => set({ barrio: e.target.value })} placeholder="Ej: Cerro de las Rosas" className={INPUT_CLS} />
            </Field>
            <Field label="Ciudad" required error={errors.ciudad}>
              <input type="text" value={form.ciudad} onChange={(e) => set({ ciudad: e.target.value })} placeholder="Ej: Córdoba" className={INPUT_CLS} />
            </Field>
          </div>
        </Section>

        {/* 4. Mapa */}
        <Section title="🗺️ Ubicación en el mapa">
          <p className="mb-3 text-xs text-gray-500">
            Hacé clic en el mapa para marcar la ubicación exacta, buscá una dirección, o usá el botón{" "}
            <strong>Usar dirección ↑</strong> para geocodificar la dirección que cargaste arriba.
          </p>
          <MapaSelectorUbicacion
            lat={form.lat}
            lng={form.lng}
            direccionInicial={form.ubicacion || undefined}
            onChange={(lat, lng) => set({ lat, lng })}
          />
        </Section>

        {/* 5. Medidas */}
        <Section title="📐 Medidas y ambientes">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { key: "ambientes",           label: "Ambientes",          placeholder: "Ej: 4" },
              { key: "dormitorios",         label: "Dormitorios",        placeholder: "Ej: 2" },
              { key: "baños",               label: "Baños",              placeholder: "Ej: 2" },
              { key: "cocheras",            label: "Cocheras",           placeholder: "Ej: 1" },
              { key: "superficieCubierta",  label: "Sup. cubierta (m²)", placeholder: "Ej: 150" },
              { key: "superficieTotal",     label: "Sup. total (m²)",    placeholder: "Ej: 500" },
            ].map(({ key, label, placeholder }) => (
              <Field key={key} label={label}>
                <input
                  type="number" min={0} value={form[key as keyof FormData] as string}
                  onChange={(e) => set({ [key]: e.target.value })}
                  placeholder={placeholder} className={INPUT_CLS}
                />
              </Field>
            ))}
          </div>
        </Section>

        {/* 5. Descripción */}
        <Section title="📝 Descripción">
          <Field label="Descripción detallada" required error={errors.descripcion}>
            <textarea
              rows={5} value={form.descripcion}
              onChange={(e) => set({ descripcion: e.target.value })}
              placeholder="Describí la propiedad con todos los detalles relevantes…"
              className={`${INPUT_CLS} resize-y leading-relaxed`}
            />
            <p className="text-right text-xs text-gray-400">{form.descripcion.length} caracteres</p>
          </Field>
        </Section>

        {/* 6. Características */}
        <Section title="✅ Características">
          <DynamicList label="Características" placeholder="Ej: Piscina con deck de madera" items={form.caracteristicas} onChange={(caracteristicas) => set({ caracteristicas })} />
        </Section>

        {/* 7. Servicios */}
        <Section title="⚡ Servicios disponibles">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {SERVICIOS_COMUNES.map((s) => (
              <label key={s} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 p-3 hover:bg-blue-50 transition-colors">
                <input
                  type="checkbox" checked={form.servicios.includes(s)}
                  onChange={(e) => set({ servicios: e.target.checked ? [...form.servicios, s] : form.servicios.filter((x) => x !== s) })}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                <span className="text-xs font-medium text-gray-700">{s}</span>
              </label>
            ))}
          </div>
        </Section>

        {/* 8. Requisitos (solo alquiler) */}
        {form.operacion === "alquiler" && (
          <Section title="📋 Requisitos para alquilar">
            <DynamicList label="Requisitos" placeholder="Ej: Garantía propietario en Córdoba Capital" items={form.requisitos} onChange={(requisitos) => set({ requisitos })} />
          </Section>
        )}

        {/* 9. Imágenes */}
        <Section title="🖼️ Imágenes">
          <ImageUpload
            previews={imagePreviews}
            pendingCount={pendingCount}
            onAdd={handleAddImages}
            onRemove={handleRemoveImage}
            disabled={isBusy}
          />
          {imagePreviews.length === 0 && (
            <p className="mt-2 text-xs text-gray-400">
              Si no subís imágenes se usará una portada genérica.
            </p>
          )}
        </Section>

        {/* Resumen de errores */}
        {Object.keys(errors).length > 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="mb-2 text-sm font-bold text-red-700">⚠️ Corregí los siguientes errores antes de guardar:</p>
            <ul className="list-inside list-disc space-y-1 text-xs text-red-600">
              {Object.values(errors).map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        {/* Barra de progreso de subida */}
        {uploadProgress && (
          <UploadProgressBar current={uploadProgress.current} total={uploadProgress.total} />
        )}

        {/* Acciones */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button" onClick={onCancel} disabled={isBusy}
            className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit" disabled={isBusy}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-colors disabled:opacity-60"
          >
            {uploading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {uploadProgress
                  ? `Subiendo ${uploadProgress.current}/${uploadProgress.total}…`
                  : "Preparando imágenes…"}
              </>
            ) : saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Guardando…
              </>
            ) : isEdit ? "💾 Guardar cambios" : "✅ Publicar propiedad"}
          </button>
        </div>
      </form>
    </main>
  );
}
