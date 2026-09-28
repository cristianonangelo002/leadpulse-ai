import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null, error: "Supabase não configurado." };
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { supabase, user: null, error: "Sessão inválida. Entre novamente." };
  return { supabase, user, error: null };
}
