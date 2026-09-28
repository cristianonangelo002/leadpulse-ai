import Link from "next/link";
import { ArrowRight, Bot, Search, Sparkles, Target, TrendingUp, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DEMO_LEADS, STATUS_CONFIG } from "@/lib/constants";
import type { Lead, LeadStatus } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/page-heading";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.from("leads").select("*").order("created_at", { ascending: false }) : { data: null };
  const leads = (data as Lead[] | null) ?? DEMO_LEADS;
  const scored = leads.filter((lead) => lead.ai_score !== null);
  const average = scored.length ? Math.round(scored.reduce((sum, lead) => sum + (lead.ai_score ?? 0), 0) / scored.length) : 0;
  const won = leads.filter((lead) => lead.status === "ganho").length;
  const qualificationRate = leads.length ? Math.round((scored.length / leads.length) * 100) : 0;
  const stats = [
    { label: "Total de leads", value: leads.length, detail: "na sua base", icon: Users, tone: "text-violet-400" },
    { label: "Score médio", value: average || "—", detail: "de 100 pontos", icon: Sparkles, tone: "text-cyan-400" },
    { label: "Taxa qualificada", value: `${qualificationRate}%`, detail: "com análise de IA", icon: Target, tone: "text-amber-400" },
    { label: "Negócios ganhos", value: won, detail: "neste pipeline", icon: TrendingUp, tone: "text-emerald-400" },
  ];
  return <>
    <PageHeading eyebrow="Visão geral" title="Seu pulso comercial, em tempo real." description="Acompanhe a saúde da sua prospecção e descubra onde concentrar energia hoje." action={<Button asChild><Link href="/extrator"><Search className="h-4 w-4" />Encontrar novos leads</Link></Button>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <Card key={stat.label} className="relative overflow-hidden"><div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-violet-500/5 blur-2xl" /><CardContent className="pt-5"><div className="flex items-center justify-between"><span className="text-xs font-medium text-zinc-500">{stat.label}</span><stat.icon className={`h-4 w-4 ${stat.tone}`} /></div><p className="mt-4 text-3xl font-semibold tracking-tight">{stat.value}</p><p className="mt-1 text-xs text-zinc-600">{stat.detail}</p></CardContent></Card>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
      <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Funil comercial</h2><p className="mt-1 text-xs text-zinc-500">Distribuição atual dos leads</p></div><Button variant="ghost" size="sm" asChild><Link href="/pipeline">Ver pipeline <ArrowRight className="h-3 w-3" /></Link></Button></div><div className="mt-7 space-y-5">{(Object.entries(STATUS_CONFIG) as [LeadStatus, (typeof STATUS_CONFIG)[LeadStatus]][]).slice(0,5).map(([status, config]) => { const count = leads.filter((lead) => lead.status === status).length; const width = leads.length ? Math.max(4, count / leads.length * 100) : 0; return <div key={status}><div className="mb-2 flex justify-between text-xs"><span className="flex items-center gap-2 text-zinc-400"><span className={`h-2 w-2 rounded-full ${config.dot}`} />{config.label}</span><span className="font-semibold text-zinc-300">{count}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-400" style={{ width: `${width}%` }} /></div></div>; })}</div></CardContent></Card>
      <Card className="bg-gradient-to-br from-zinc-900 to-violet-950/20"><CardContent className="flex h-full flex-col pt-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><Bot className="h-5 w-5 text-violet-400" /></span><h2 className="mt-5 text-lg font-semibold">Próxima melhor ação</h2><p className="mt-2 text-sm leading-relaxed text-zinc-400">Você tem <strong className="text-zinc-200">{leads.filter((lead) => lead.status === "capturado").length} leads capturados</strong> aguardando qualificação. Use a IA para priorizar quem tem mais chance de converter.</p><Button className="mt-auto" variant="secondary" asChild><Link href="/pipeline">Qualificar agora <ArrowRight className="h-4 w-4" /></Link></Button></CardContent></Card>
    </div>
  </>;
}
