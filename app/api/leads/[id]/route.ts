import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/api-auth";

const schema = z.object({ status: z.enum(["capturado", "qualificado", "contato", "reuniao", "ganho", "perdido"]).optional(), meeting_notes: z.string().max(10000).optional() }).refine((value) => value.status !== undefined || value.meeting_notes !== undefined);
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Alteração inválida." }, { status: 400 });
  const { supabase, user, error } = await requireUser(); if (!supabase || !user) return NextResponse.json({ error }, { status: 401 });
  const { data, error: dbError } = await supabase.from("leads").update(parsed.data).eq("id", id).eq("user_id", user.id).select("*").single();
  if (dbError) return NextResponse.json({ error: "Não foi possível atualizar o lead." }, { status: 500 }); return NextResponse.json({ lead: data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user, error } = await requireUser();
  if (!supabase || !user) return NextResponse.json({ error }, { status: 401 });
  const { error: dbError, count } = await supabase
    .from("leads")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", user.id);
  if (dbError) return NextResponse.json({ error: "Não foi possível apagar o lead." }, { status: 500 });
  if (!count) return NextResponse.json({ error: "Lead não encontrado." }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
