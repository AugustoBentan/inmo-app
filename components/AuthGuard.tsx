"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=" + window.location.pathname);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-amber-500" />
          <p className="text-sm">Verificando sesión…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
