"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, LogOut, PanelLeft, Search, Settings2, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/dashboard", label: "Visão geral", icon: BarChart3 },
  { href: "/extrator", label: "Extrator", icon: Search },
  { href: "/pipeline", label: "Pipeline", icon: Users },
  { href: "/configuracoes/integracoes", label: "Integrações", icon: Settings2 },
];

export function AppShell({ children, userEmail }: { children: React.ReactNode; userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  async function logout() { const supabase = createClient(); await supabase?.auth.signOut(); router.push("/auth"); router.refresh(); }
  return <div className="min-h-screen bg-zinc-950">
    <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-800 bg-zinc-950/95 p-4 backdrop-blur-xl transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
      <Logo className="px-2 py-3" />
      <nav className="mt-7 space-y-1">
        {nav.map((item) => { const active = pathname.startsWith(item.href); return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition", active ? "bg-violet-500/10 text-violet-300" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200")}><item.icon className="h-4 w-4" />{item.label}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />}</Link>; })}
      </nav>
      <div className="absolute inset-x-4 bottom-4">
        <div className="mb-3 rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 p-3">
          <Sparkles className="mb-2 h-4 w-4 text-violet-400" /><p className="text-xs font-medium">IA pronta para qualificar</p><p className="mt-1 text-[11px] text-zinc-500">Use sua própria chave. Seus dados permanecem seus.</p>
        </div>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 font-semibold text-zinc-300">{userEmail.slice(0,1).toUpperCase()}</span><span className="min-w-0 flex-1 truncate">{userEmail}</span><LogOut className="h-4 w-4" /></button>
      </div>
    </aside>
    {open && <button aria-label="Fechar menu" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/60 lg:hidden" />}
    <main className="lg:pl-64"><header className="sticky top-0 z-20 flex h-16 items-center border-b border-zinc-900 bg-zinc-950/80 px-4 backdrop-blur-xl lg:px-8"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}><PanelLeft /></Button><div className="ml-auto flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /><span className="text-xs text-zinc-500">Sistema operacional</span></div></header><div className="p-4 lg:p-8">{children}</div></main>
  </div>;
}
