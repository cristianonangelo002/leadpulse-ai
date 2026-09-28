"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({ fullName: z.string().optional(), email: z.string().email("Informe um e-mail válido"), password: z.string().min(6, "Use ao menos 6 caracteres") });
type FormData = z.infer<typeof schema>;

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  async function submit(values: FormData) {
    setMessage(null); const supabase = createClient();
    if (!supabase) { router.push("/dashboard"); return; }
    const result = mode === "login" ? await supabase.auth.signInWithPassword({ email: values.email, password: values.password }) : await supabase.auth.signUp({ email: values.email, password: values.password, options: { data: { full_name: values.fullName } } });
    if (result.error) { setMessage(result.error.message); return; }
    if (mode === "signup" && !result.data.session) { setMessage("Confira seu e-mail para confirmar o cadastro."); return; }
    router.push("/dashboard"); router.refresh();
  }
  return <div><p className="text-sm font-medium text-violet-400">Bem-vindo ao LeadPulse</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">{mode === "login" ? "Acesse sua conta" : "Crie sua conta"}</h2><p className="mt-2 text-sm text-zinc-500">{mode === "login" ? "Continue de onde parou sua prospecção." : "Comece a prospectar melhor em poucos minutos."}</p>
    <form onSubmit={handleSubmit(submit)} className="mt-8 space-y-4">{mode === "signup" && <label className="block text-sm text-zinc-400">Nome completo<Input className="mt-2" placeholder="Seu nome" {...register("fullName")} /></label>}<label className="block text-sm text-zinc-400">E-mail<Input className="mt-2" type="email" placeholder="voce@empresa.com" {...register("email")} />{errors.email && <span className="mt-1 block text-xs text-red-400">{errors.email.message}</span>}</label><label className="block text-sm text-zinc-400">Senha<div className="relative mt-2"><Input type={show ? "text" : "password"} placeholder="••••••••" className="pr-11" {...register("password")} /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-zinc-500">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>{errors.password && <span className="mt-1 block text-xs text-red-400">{errors.password.message}</span>}</label>{message && <p className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-300">{message}</p>}<Button className="w-full" size="lg" disabled={isSubmitting}>{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}{mode === "login" ? "Entrar na plataforma" : "Criar conta gratuita"}</Button></form>
    <p className="mt-6 text-center text-sm text-zinc-500">{mode === "login" ? "Ainda não tem uma conta?" : "Já possui uma conta?"} <button className="font-medium text-violet-400 hover:text-violet-300" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(null); }}>{mode === "login" ? "Cadastre-se" : "Entrar"}</button></p>
  </div>;
}
