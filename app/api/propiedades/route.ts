import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { rowToPropiedad, propiedadToRow, PropiedadRow } from "@/lib/supabase/transforms";

// GET /api/propiedades — listado completo
export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("propiedades")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data as PropiedadRow[]).map(rowToPropiedad));
}

// POST /api/propiedades — crear nueva propiedad
export async function POST(req: Request) {
  const supabase = createServerClient();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("propiedades")
    .insert(propiedadToRow(body))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(rowToPropiedad(data as PropiedadRow), { status: 201 });
}
