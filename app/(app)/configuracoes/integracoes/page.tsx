import { createClient } from "@/lib/supabase/server";
import type { IntegrationProvider, IntegrationSummary } from "@/types/database";
import { PageHeading } from "@/components/page-heading";
import { IntegrationsForm } from "@/components/integrations-form";

interface Row { provider: IntegrationProvider; api_key: string; updated_at: string }
export default async function IntegrationsPage() {
  const supabase = await createClient(); const { data } = supabase ? await supabase.from("user_integrations").select("provider, api_key, updated_at") : { data: null };
  const rows = (data as Row[] | null) ?? [];
  const integrations: IntegrationSummary[] = (["serper", "google_places", "openai", "gemini"] as IntegrationProvider[]).map((provider) => { const row = rows.find((item) => item.provider === provider); return { provider, configured: Boolean(row), maskedKey: row ? `${row.api_key.slice(0,4)}••••••••${row.api_key.slice(-4)}` : null, updatedAt: row?.updated_at ?? null }; });
  return <><PageHeading eyebrow="Configurações" title="Suas integrações, suas chaves." description="Conecte um provedor de dados e um modelo de IA. As chaves são isoladas por usuário e utilizadas somente nas rotas do servidor." /><IntegrationsForm initial={integrations} demo={!supabase} /></>;
}
