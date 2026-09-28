import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/logo";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function AuthPage() {
  return <main className="relative grid min-h-screen overflow-hidden bg-zinc-950 lg:grid-cols-2">
    <div className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
    <section className="relative hidden border-r border-zinc-900 p-12 lg:flex lg:flex-col">
      <Logo />
      <div className="my-auto max-w-xl"><span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">Prospecção orientada por dados</span><h1 className="mt-7 text-5xl font-semibold leading-tight tracking-tight">Transforme buscas em <span className="text-gradient">oportunidades reais.</span></h1><p className="mt-5 max-w-lg text-lg leading-relaxed text-zinc-400">Encontre empresas, qualifique com IA e acompanhe cada oportunidade em um pipeline simples.</p><div className="mt-10 grid gap-4 text-sm text-zinc-300 sm:grid-cols-2">{["Encontre leads locais", "Score inteligente", "Pipeline visual", "Seus dados protegidos"].map((item) => <div key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{item}</div>)}</div></div>
      <p className="text-xs text-zinc-600">LeadPulse AI · Feito para times que querem crescer <ArrowUpRight className="inline h-3 w-3" /></p>
    </section>
    <section className="relative flex items-center justify-center p-6"><div className="w-full max-w-md"><Logo className="mb-10 lg:hidden" /><AuthForm /></div></section>
  </main>;
}
