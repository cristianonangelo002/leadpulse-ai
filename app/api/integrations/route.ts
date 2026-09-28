import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/api-auth";

const schema = z.object({ provider: z.enum(["serper", "google_places", "openai", "gemini"]), apiKey: z.string().min(8).max(500) });
export async function PUT(request: Request) {
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  const { supabase, user, error } = await requireUser(); if (!supabase || !user) return NextResponse.json({ error }, { status: 401 });
  const { provider, apiKey } = parsed.data; const { error: dbError } = await supabase.from("user_integrations").upsert({ user_id: user.id, provider, api_key: apiKey }, { onConflict: "user_id,provider" });
  if (dbError) return NextResponse.json({ error: "Não foi possível salvar a integração." }, { status: 500 });
  return NextResponse.json({ maskedKey: `${apiKey.slice(0,4)}••••••••${apiKey.slice(-4)}` });
}
