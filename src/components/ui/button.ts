import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "accent"
  | "whatsapp"
  | "secondary"
  | "ghost";

export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-teal-700 text-white hover:bg-teal-800",
  accent: "bg-amber-500 text-slate-950 hover:bg-amber-400",
  whatsapp: "bg-emerald-600 text-white hover:bg-emerald-700",
  secondary: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100",
  ghost: "text-teal-800 hover:bg-teal-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variantClasses[variant], sizeClasses[size], className);
}
