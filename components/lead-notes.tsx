"use client";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LeadNotes({ leadId, initialNotes, demo }: { leadId: string; initialNotes: string; demo: boolean }) {
  const [notes, setNotes] = useState(initialNotes); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false);
  async function save() { setSaving(true); if (!demo) await fetch(`/api/leads/${leadId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ meeting_notes: notes }) }); setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  return <Card><CardContent className="pt-5"><h2 className="text-sm font-semibold">Notas da reunião</h2><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={6} placeholder="Registre contexto, objeções e próximos passos..." className="mt-4 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300 outline-none placeholder:text-zinc-700 focus:border-violet-500" /><Button size="sm" variant="secondary" className="mt-3 w-full" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}{saved ? "Notas salvas" : "Salvar notas"}</Button></CardContent></Card>;
}
