import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  return <AppShell userEmail={data.user?.email ?? "modo@demo.local"}>{children}</AppShell>;
}
