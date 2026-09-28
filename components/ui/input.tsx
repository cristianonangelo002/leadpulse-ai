import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("flex h-11 w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 disabled:opacity-50", className)} {...props} />
));
Input.displayName = "Input";
