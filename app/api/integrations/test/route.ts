import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/api-auth";

const schema = z.object({ provider: z.enum(["serper", "google_places", "openai", "gemini"]) });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Provedor inválido." }, { status: 400 });
  const { supabase, user, error } = await requireUser(); if (!supabase || !user) return NextResponse.json({ error }, { status: 401 });
  const { data } = await supabase.from("user_integrations").select("api_key").eq("user_id", user.id).eq("provider", parsed.data.provider).single();
  if (!data) return NextResponse.json({ error: "Configure a chave primeiro." }, { status: 404 });
  const provider = parsed.data.provider; let response: Response;
  if (provider === "serper") response = await fetch("https://google.serper.dev/places", { method: "POST", headers: { "X-API-KEY": data.api_key, "Content-Type": "application/json" }, body: JSON.stringify({ q: "café", num: 1 }) });
  else if (provider === "google_places") response = await fetch("https://places.googleapis.com/v1/places:searchText", { method: "POST", headers: { "X-Goog-Api-Key": data.api_key, "X-Goog-FieldMask": "places.id", "Content-Type": "application/json" }, body: JSON.stringify({ textQuery: "café" }) });
  else if (provider === "openai") response = await fetch("https://api.openai.com/v1/models", { headers: { Authorization: `Bearer ${data.api_key}` } });
  else response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(data.api_key)}`);
  if (!response.ok) return NextResponse.json({ error: `A chave foi recusada pelo provedor (${response.status}).` }, { status: 400 });
  return NextResponse.json({ ok: true });
}
