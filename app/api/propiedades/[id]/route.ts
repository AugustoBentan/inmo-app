import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { rowToPropiedad, propiedadToRow, PropiedadRow } from "@/lib/supabase/transforms";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/propiedades/[id]
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("propiedades")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  return NextResponse.json(rowToPropiedad(data as PropiedadRow));
}

// PUT /api/propiedades/[id] — editar
export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = createServerClient();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("propiedades")
    .update(propiedadToRow(body))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(rowToPropiedad(data as PropiedadRow));
}

// DELETE /api/propiedades/[id]
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = createServerClient();

  const { error } = await supabase.from("propiedades").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
