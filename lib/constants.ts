import type { LeadStatus } from "@/types/database";

export const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; dot: string }> = {
  capturado: { label: "Capturados", color: "border-zinc-700", dot: "bg-zinc-400" },
  qualificado: { label: "Qualificados", color: "border-violet-500/40", dot: "bg-violet-400" },
  contato: { label: "Em contato", color: "border-blue-500/40", dot: "bg-blue-400" },
  reuniao: { label: "Reunião", color: "border-amber-500/40", dot: "bg-amber-400" },
  ganho: { label: "Ganhos", color: "border-emerald-500/40", dot: "bg-emerald-400" },
  perdido: { label: "Perdidos", color: "border-red-500/40", dot: "bg-red-400" },
};

export const DEMO_LEADS = [
  { id: "demo-1", user_id: "demo", name: "Studio Atlas Fitness", phone: "(11) 99120-4410", address: "Pinheiros, São Paulo", website: "studioatlas.com.br", rating: 4.8, status: "qualificado", ai_score: 92, ai_summary: "Academia boutique com forte presença digital e alto potencial para expansão.", ai_pitch: "Vi que o Studio Atlas tem avaliações excelentes. Podemos ajudar a transformar esse engajamento em novas matrículas previsíveis.", meeting_notes: null, created_at: new Date().toISOString() },
  { id: "demo-2", user_id: "demo", name: "Move Academia", phone: "(11) 3451-8820", address: "Moema, São Paulo", website: "moveacademia.com", rating: 4.6, status: "capturado", ai_score: null, ai_summary: null, ai_pitch: null, meeting_notes: null, created_at: new Date().toISOString() },
  { id: "demo-3", user_id: "demo", name: "Clínica Vitta", phone: "(21) 98841-2210", address: "Botafogo, Rio de Janeiro", website: "clinicavitta.com.br", rating: 4.9, status: "contato", ai_score: 86, ai_summary: "Clínica multiprofissional bem avaliada, com oportunidade em aquisição local.", ai_pitch: "A reputação da Vitta já é um ativo. Nossa proposta é ampliar a descoberta local e converter avaliações em agendas cheias.", meeting_notes: null, created_at: new Date().toISOString() },
] satisfies import("@/types/database").Lead[];
