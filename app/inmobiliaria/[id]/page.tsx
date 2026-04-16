import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { rowToPropiedad, PropiedadRow } from "@/lib/supabase/transforms";
import { formatPrecio, TIPO_LABELS } from "../data/propiedades";
import PropertyDetailClient from "./PropertyDetailClient";

// Siempre renderizar fresco (datos cambian desde el admin)
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function getPropiedad(id: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("propiedades")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return rowToPropiedad(data as PropiedadRow);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await getPropiedad(id);
  if (!p) return { title: "Propiedad no encontrada" };
  return {
    title: `${p.titulo} | Inmobiliaria & Seguros`,
    description: `${TIPO_LABELS[p.tipo]} en ${p.operacion} — ${formatPrecio(p.precio, p.moneda)} — ${p.ubicacion}`,
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const propiedad = await getPropiedad(id);
  if (!propiedad) notFound();
  return <PropertyDetailClient p={propiedad} />;
}
