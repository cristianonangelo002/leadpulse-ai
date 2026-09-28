import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return <div className={cn("flex items-center gap-2.5", className)}><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-glow"><Activity className="h-5 w-5 text-white" /></span>{!compact && <span className="text-lg font-bold tracking-tight">LeadPulse <span className="text-violet-400">AI</span></span>}</div>;
}
