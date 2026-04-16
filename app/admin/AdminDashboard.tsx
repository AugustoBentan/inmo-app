"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Propiedad } from "../inmobiliaria/data/propiedades";
import PropertyTable from "./components/PropertyTable";
import PropertyForm from "./components/PropertyForm";
import { useAuth } from "@/context/AuthContext";
import { useToast, ToastContainer } from "@/components/Toast";

// ─── Modal de confirmación ────────────────────────────────────────────────────
function ConfirmDialog({
  titulo,
  onConfirm,
  onCancel,
  loading,
}: {
  titulo: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <span className="text-2xl">🗑️</span>
        </div>
        <h3 className="mb-2 text-center text-lg font-extrabold text-gray-900">
          ¿Eliminar propiedad?
        </h3>
        <p className="mb-6 text-center text-sm text-gray-500">
          <strong className="text-gray-700">&ldquo;{titulo}&rdquo;</strong> será eliminada
          permanentemente. Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Eliminando…" : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard principal ──────────────────────────────────────────────────────
type View = "list" | "create" | "edit";

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toasts, toast, dismiss } = useToast();
  const [formResetSignal, setFormResetSignal] = useState(0);
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [view, setView] = useState<View>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const propiedadToEdit = propiedades.find((p) => p.id === editingId) ?? null;
  const propiedadToDelete = propiedades.find((p) => p.id === confirmDeleteId);

  // ── Cargar listado ──
  const fetchPropiedades = useCallback(async () => {
    setLoadingList(true);
    setApiError(null);
    try {
      const res = await fetch("/api/propiedades");
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setPropiedades(await res.json());
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "Error al cargar propiedades");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => { fetchPropiedades(); }, [fetchPropiedades]);

  // ── Guardar (crear o editar) ──
  const handleSave = async (p: Propiedad) => {
    setSaving(true);
    setApiError(null);
    try {
      const isEdit = view === "edit";
      const res = await fetch(
        isEdit ? `/api/propiedades/${p.id}` : "/api/propiedades",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? `Error ${res.status}`);
      }
      await fetchPropiedades();
      if (isEdit) {
        toast(`"${p.titulo}" actualizada con éxito`, "success");
        setView("list");
        setEditingId(null);
      } else {
        toast(`"${p.titulo}" publicada con éxito ✅`, "success");
        setFormResetSignal((s) => s + 1); // limpia el formulario
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al guardar";
      setApiError(msg);
      toast("Error al guardar: " + msg, "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Eliminar ──
  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    const titulo = propiedadToDelete?.titulo ?? "Propiedad";
    setDeleting(true);
    setApiError(null);
    try {
      const res = await fetch(`/api/propiedades/${confirmDeleteId}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) throw new Error(`Error ${res.status}`);
      await fetchPropiedades();
      setConfirmDeleteId(null);
      toast(`"${titulo}" eliminada`, "info");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al eliminar";
      setApiError(msg);
      toast("Error al eliminar: " + msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* Topbar */}
      <header className="border-b border-slate-700 bg-slate-900 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔒</span>
            <div>
              <p className="text-xs font-medium text-slate-400">Panel de administración</p>
              <p className="text-sm font-bold text-white">Inmobiliaria &amp; Seguros</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden text-xs text-slate-500 sm:block truncate max-w-[160px]">
                {user.email}
              </span>
            )}
            <a
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              ← Ver sitio
            </a>
            <button
              onClick={async () => { await signOut(); router.push("/login"); }}
              className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-red-600 hover:text-white transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Banner de error de API */}
      {apiError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 text-center text-sm text-red-700">
          ⛔ {apiError}
          <button onClick={() => setApiError(null)} className="ml-3 font-bold underline">Cerrar</button>
        </div>
      )}

      {/* Cargando */}
      {loadingList && view === "list" ? (
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
            <p className="text-sm">Cargando propiedades…</p>
          </div>
        </div>
      ) : view === "list" ? (
        <PropertyTable
          propiedades={propiedades}
          onEdit={(id) => { setEditingId(id); setView("edit"); }}
          onDelete={(id) => setConfirmDeleteId(id)}
          onCreate={() => setView("create")}
        />
      ) : (
        <PropertyForm
          propiedad={propiedadToEdit}
          saving={saving}
          resetSignal={formResetSignal}
          onSave={handleSave}
          onCancel={() => { setView("list"); setEditingId(null); }}
        />
      )}

      {confirmDeleteId && propiedadToDelete && (
        <ConfirmDialog
          titulo={propiedadToDelete.titulo}
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
