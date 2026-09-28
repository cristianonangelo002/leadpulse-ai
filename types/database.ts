export const LEAD_STATUSES = ["capturado", "qualificado", "contato", "reuniao", "ganho", "perdido"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  rating: number | null;
  status: LeadStatus;
  ai_score: number | null;
  ai_summary: string | null;
  ai_pitch: string | null;
  meeting_notes: string | null;
  created_at: string;
}

export interface ExtractedLead {
  externalId: string;
  name: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  rating: number | null;
  googleMapsUrl: string;
}

export type IntegrationProvider = "serper" | "google_places" | "openai" | "gemini";

export interface IntegrationSummary {
  provider: IntegrationProvider;
  configured: boolean;
  maskedKey: string | null;
  updatedAt: string | null;
}
