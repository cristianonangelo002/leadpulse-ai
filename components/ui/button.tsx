import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      default: "bg-violet-600 text-white shadow-lg shadow-violet-950/30 hover:bg-violet-500",
      secondary: "border border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
      ghost: "text-zinc-400 hover:bg-zinc-800 hover:text-white",
      danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20",
    },
    size: { default: "h-10 px-4 py-2", sm: "h-8 rounded-md px-3 text-xs", lg: "h-12 px-6", icon: "h-9 w-9" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";
