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
