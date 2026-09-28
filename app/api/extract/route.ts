import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/api-auth";
import type { ExtractedLead } from "@/types/database";

const schema = z.object({ query: z.string().min(2).max(120), location: z.string().min(2).max(120), limit: z.number().int().min(1).max(20) });
interface SerperPlace { cid?: string; title?: string; address?: string; phoneNumber?: string; website?: string; rating?: number }
interface GooglePlace { id?: string; displayName?: { text?: string }; formattedAddress?: string; nationalPhoneNumber?: string; websiteUri?: string; rating?: number }

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Preencha os campos de busca corretamente." }, { status: 400 });
  const { supabase, user, error } = await requireUser(); if (!supabase || !user) return NextResponse.json({ error }, { status: 401 });
  const { data: integrations } = await supabase.from("user_integrations").select("provider, api_key").eq("user_id", user.id).in("provider", ["serper", "google_places"]);
  const integration = integrations?.find((item) => item.provider === "serper") ?? integrations?.find((item) => item.provider === "google_places");
  if (!integration) return NextResponse.json({ error: "Configure uma integração de extração antes de buscar." }, { status: 409 });
  const searchText = `${parsed.data.query} em ${parsed.data.location}`; let leads: ExtractedLead[] = [];
  if (integration.provider === "serper") {
    const response = await fetch("https://google.serper.dev/places", { method: "POST", headers: { "X-API-KEY": integration.api_key, "Content-Type": "application/json" }, body: JSON.stringify({ q: searchText, num: parsed.data.limit }), cache: "no-store" });
    if (!response.ok) return NextResponse.json({ error: `A API Serper recusou a busca (${response.status}).` }, { status: 502 });
    const json = await response.json() as { places?: SerperPlace[] };
    leads = (json.places ?? []).slice(0, parsed.data.limit).map((place, index) => ({ externalId: place.cid ?? `serper-${index}`, name: place.title ?? "Empresa sem nome", phone: place.phoneNumber ?? null, address: place.address ?? null, website: place.website ?? null, rating: place.rating ?? null }));
  } else {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", { method: "POST", headers: { "X-Goog-Api-Key": integration.api_key, "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating", "Content-Type": "application/json" }, body: JSON.stringify({ textQuery: searchText, maxResultCount: parsed.data.limit, languageCode: "pt-BR" }), cache: "no-store" });
    if (!response.ok) return NextResponse.json({ error: `A API Google Places recusou a busca (${response.status}).` }, { status: 502 });
    const json = await response.json() as { places?: GooglePlace[] };
    leads = (json.places ?? []).map((place, index) => ({ externalId: place.id ?? `google-${index}`, name: place.displayName?.text ?? "Empresa sem nome", phone: place.nationalPhoneNumber ?? null, address: place.formattedAddress ?? null, website: place.websiteUri ?? null, rating: place.rating ?? null }));
  }
  return NextResponse.json({ leads });
}
