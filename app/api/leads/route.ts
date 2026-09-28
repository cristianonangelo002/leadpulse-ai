import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/api-auth";

const leadSchema = z.object({ externalId: z.string(), name: z.string().min(1), phone: z.string().nullable(), address: z.string().nullable(), website: z.string().nullable(), rating: z.number().min(0).max(5).nullable() });
const schema = z.object({ leads: z.array(leadSchema).min(1).max(50) });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Lista de leads inválida." }, { status: 400 });
  const { supabase, user, error } = await requireUser(); if (!supabase || !user) return NextResponse.json({ error }, { status: 401 });
  const rows = parsed.data.leads.map(({ externalId: _externalId, ...lead }) => ({ ...lead, user_id: user.id, status: "capturado" as const }));
  const { error: dbError } = await supabase.from("leads").insert(rows); if (dbError) return NextResponse.json({ error: "Não foi possível importar os leads." }, { status: 500 });
  return NextResponse.json({ imported: rows.length });
}
