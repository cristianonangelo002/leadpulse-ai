import { PageHeading } from "@/components/page-heading";
import { ExtractorClient } from "@/components/extractor-client";

export default function ExtractorPage() {
  return <><PageHeading eyebrow="Descoberta" title="Encontre os leads certos." description="Busque empresas por segmento e localização. Revise os resultados antes de enviá-los ao pipeline." /><ExtractorClient /></>;
}
