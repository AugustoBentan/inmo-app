"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Side = "left" | "right" | null;

export default function SplitScreen() {
  const [hovered, setHovered] = useState<Side>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Width expansion only on desktop (hover with mouse)
  const getExpandStyle = (side: Side): React.CSSProperties => {
    if (!isDesktop) return {};
    if (hovered === null) return { width: "50%" };
    return { width: hovered === side ? "60%" : "40%" };
  };

  const dimmed = (side: Side) => hovered !== null && hovered !== side;

  return (
    // Mobile: flex-col (top/bottom) — Desktop: flex-row (left/right)
    <main className="flex flex-col md:flex-row h-screen w-full overflow-hidden">

      {/* ── SEGUROS — top on mobile, left on desktop ── */}
      <section
        className="relative flex flex-col items-center justify-center
          h-1/2 w-full md:h-full
          transition-all duration-500 ease-in-out"
        style={{
          ...getExpandStyle("left"),
          backgroundImage:
            "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onMouseEnter={() => isDesktop && setHovered("left")}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65" />
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ease-in-out ${
            dimmed("left") ? "opacity-55" : "opacity-0"
          }`}
        />
        <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center text-white md:gap-6 md:px-8">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-300 md:text-xs">
            Protegé lo que más importa
          </span>
          <h2 className="text-3xl font-extrabold leading-tight drop-shadow-lg md:text-5xl lg:text-6xl">
            Tu tranquilidad,<br />nuestra prioridad
          </h2>
          <p className="max-w-xs text-sm text-white/80 md:max-w-sm md:text-base">
            Coberturas personalizadas para vos, tu familia y tu empresa.
          </p>
          <Link
            href="/seguros"
            className="rounded-full bg-sky-500 px-7 py-3 text-sm font-bold tracking-wide text-white shadow-lg
              transition-all duration-300 hover:scale-105 hover:bg-sky-400 hover:shadow-sky-500/40
              focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            Cotizar Seguros
          </Link>
        </div>
      </section>

      {/* Divider — horizontal on mobile, vertical on desktop */}
      <div className="shrink-0 bg-white/30 h-px w-full md:h-full md:w-px" />

      {/* ── INMOBILIARIA — bottom on mobile, right on desktop ── */}
      <section
        className="relative flex flex-col items-center justify-center
          h-1/2 w-full md:h-full
          transition-all duration-500 ease-in-out"
        style={{
          ...getExpandStyle("right"),
          backgroundImage:
            "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onMouseEnter={() => isDesktop && setHovered("right")}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65" />
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ease-in-out ${
            dimmed("right") ? "opacity-55" : "opacity-0"
          }`}
        />
        <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center text-white md:gap-6 md:px-8">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-300 md:text-xs">
            Encontrá tu lugar ideal
          </span>
          <h2 className="text-3xl font-extrabold leading-tight drop-shadow-lg md:text-5xl lg:text-6xl">
            Propiedades que<br />transforman vidas
          </h2>
          <p className="max-w-xs text-sm text-white/80 md:max-w-sm md:text-base">
            Casas, departamentos y locales comerciales en los mejores barrios.
          </p>
          <Link
            href="/inmobiliaria"
            className="rounded-full bg-amber-500 px-7 py-3 text-sm font-bold tracking-wide text-white shadow-lg
              transition-all duration-300 hover:scale-105 hover:bg-amber-400 hover:shadow-amber-500/40
              focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            Buscar Propiedades
          </Link>
        </div>
      </section>
    </main>
  );
}
