"use client";

import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  return { toasts, toast, dismiss };
}

// ─── Contenedor ───────────────────────────────────────────────────────────────
const STYLES: Record<ToastType, string> = {
  success: "bg-emerald-600 border-emerald-500",
  error:   "bg-red-600 border-red-500",
  info:    "bg-blue-600 border-blue-500",
};
const ICONS: Record<ToastType, string> = {
  success: "✅",
  error:   "⛔",
  info:    "ℹ️",
};

function ToastBubble({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      role="alert"
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-white shadow-2xl ${STYLES[item.type]}`}
    >
      <span className="shrink-0 text-base">{ICONS[item.type]}</span>
      <p className="flex-1 text-sm font-semibold leading-snug">{item.message}</p>
      <button
        onClick={() => onDismiss(item.id)}
        aria-label="Cerrar"
        className="shrink-0 text-lg leading-none opacity-70 transition-opacity hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[200] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastBubble key={t.id} item={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
