import type { Propiedad } from "@/app/inmobiliaria/data/propiedades";

// ─── Tipo que refleja exactamente las columnas de Supabase ───────────────────
export type PropiedadRow = {
  id: string;
  titulo: string;
  operacion: string;
  tipo: string;
  precio: number;
  moneda: string;
  ubicacion: string;
  barrio: string;
  ciudad: string;
  ambientes: number | null;
  dormitorios: number | null;
  banios: number | null;       // "baños" en TS → "banios" en SQL
  cocheras: number | null;
  superficie_cubierta: number | null;
  superficie_total: number | null;
  expensas: number | null;
  descripcion: string;
  caracteristicas: string[];
  servicios: string[];
  requisitos: string[];
  images: string[];
  destacada: boolean;
  created_at: string;
  updated_at: string;
};

// DB row → TypeScript Propiedad
export function rowToPropiedad(row: PropiedadRow): Propiedad {
  return {
    id: row.id,
    titulo: row.titulo,
    operacion: row.operacion as Propiedad["operacion"],
    tipo: row.tipo as Propiedad["tipo"],
    precio: Number(row.precio),
    moneda: row.moneda as Propiedad["moneda"],
    ubicacion: row.ubicacion,
    barrio: row.barrio ?? "",
    ciudad: row.ciudad,
    ambientes: row.ambientes,
    dormitorios: row.dormitorios,
    baños: row.banios,
    cocheras: row.cocheras,
    superficieCubierta: row.superficie_cubierta,
    superficieTotal: row.superficie_total,
    expensas: row.expensas,
    descripcion: row.descripcion,
    caracteristicas: row.caracteristicas ?? [],
    servicios: row.servicios ?? [],
    requisitos: row.requisitos ?? [],
    images: row.images ?? [],
    destacada: row.destacada,
  };
}

// TypeScript Propiedad → DB row (para INSERT/UPDATE)
export function propiedadToRow(
  p: Propiedad
): Omit<PropiedadRow, "id" | "created_at" | "updated_at"> {
  return {
    titulo: p.titulo,
    operacion: p.operacion,
    tipo: p.tipo,
    precio: p.precio,
    moneda: p.moneda,
    ubicacion: p.ubicacion,
    barrio: p.barrio,
    ciudad: p.ciudad,
    ambientes: p.ambientes,
    dormitorios: p.dormitorios,
    banios: p.baños ?? null,
    cocheras: p.cocheras ?? null,
    superficie_cubierta: p.superficieCubierta,
    superficie_total: p.superficieTotal,
    expensas: p.expensas,
    descripcion: p.descripcion,
    caracteristicas: p.caracteristicas,
    servicios: p.servicios,
    requisitos: p.requisitos,
    images: p.images,
    destacada: p.destacada,
  };
}
