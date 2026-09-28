import { createClient } from "@/lib/supabase/server";
import { DEMO_LEADS } from "@/lib/constants";
import type { Lead } from "@/types/database";
import { PageHeading } from "@/components/page-heading";
import { PipelineBoard } from "@/components/pipeline-board";

export default async function PipelinePage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.from("leads").select("*").order("created_at", { ascending: false }) : { data: null };
  const leads = (data as Lead[] | null) ?? DEMO_LEADS;
  return <><PageHeading eyebrow="CRM visual" title="Pipeline de oportunidades" description="Arraste cada lead entre as etapas e use IA para priorizar as melhores conversas." /><PipelineBoard initialLeads={leads} demo={!supabase} /></>;
}
