import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/api-auth";

const requestSchema = z.object({ leadId: z.string().uuid() });
const resultSchema = z.object({ score: z.number().int().min(0).max(100), summary: z.string().min(10).max(1000), pitch: z.string().min(10).max(1500) });

function promptFor(lead: { name: string; address: string | null; website: string | null; rating: number | null }) {
  return `Você é um especialista em vendas B2B. Analise este lead usando apenas os dados disponíveis. Empresa: ${lead.name}. Endereço: ${lead.address ?? "não informado"}. Website: ${lead.website ?? "não informado"}. Avaliação: ${lead.rating ?? "não informada"}. Retorne JSON puro com: score (inteiro 0-100 representando potencial comercial), summary (2 frases objetivas em português) e pitch (abordagem personalizada de 2-3 frases, sem inventar fatos).`;
}

function extractJson(text: string): unknown {
  const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try { return JSON.parse(clean); } catch { const match = clean.match(/\{[\s\S]*\}/); return match ? JSON.parse(match[0]) : null; }
}

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Lead inválido." }, { status: 400 });
  const { supabase, user, error } = await requireUser(); if (!supabase || !user) return NextResponse.json({ error }, { status: 401 });
  const { data: lead } = await supabase.from("leads").select("*").eq("id", parsed.data.leadId).eq("user_id", user.id).single(); if (!lead) return NextResponse.json({ error: "Lead não encontrado." }, { status: 404 });
  const { data: integrations } = await supabase.from("user_integrations").select("provider, api_key").eq("user_id", user.id).in("provider", ["openai", "gemini"]);
  const integration = integrations?.find((item) => item.provider === "openai") ?? integrations?.find((item) => item.provider === "gemini"); if (!integration) return NextResponse.json({ error: "Configure OpenAI ou Gemini antes de qualificar." }, { status: 409 });
  let raw: string;
  if (integration.provider === "openai") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { Authorization: `Bearer ${integration.api_key}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "gpt-4o-mini", temperature: 0.3, response_format: { type: "json_object" }, messages: [{ role: "system", content: "Responda somente em JSON válido." }, { role: "user", content: promptFor(lead) }] }) });
    if (!response.ok) return NextResponse.json({ error: `OpenAI recusou a solicitação (${response.status}).` }, { status: 502 }); const json = await response.json() as { choices?: Array<{ message?: { content?: string } }> }; raw = json.choices?.[0]?.message?.content ?? "";
  } else {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(integration.api_key)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: promptFor(lead) }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.3 } }) });
    if (!response.ok) return NextResponse.json({ error: `Gemini recusou a solicitação (${response.status}).` }, { status: 502 }); const json = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }; raw = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }
  let result: z.infer<typeof resultSchema>; try { result = resultSchema.parse(extractJson(raw)); } catch { return NextResponse.json({ error: "A IA retornou uma resposta fora do formato esperado." }, { status: 502 }); }
  const { data: updated, error: updateError } = await supabase.from("leads").update({ ai_score: result.score, ai_summary: result.summary, ai_pitch: result.pitch, status: lead.status === "capturado" ? "qualificado" : lead.status }).eq("id", lead.id).eq("user_id", user.id).select("*").single();
  if (updateError) return NextResponse.json({ error: "Análise concluída, mas não foi possível salvar." }, { status: 500 }); return NextResponse.json({ lead: updated });
}
