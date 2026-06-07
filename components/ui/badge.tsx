import { cn } from "@/lib/utils";
type V = "default" | "outline" | "success" | "warning" | "destructive";
const vs: Record<V, string> = {
  default: "bg-[var(--color-primary)]/15 text-[var(--color-primary-light)] border border-[var(--color-primary)]/20",
  outline: "border border-[var(--color-border-glow)] text-[var(--color-muted-foreground)]",
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  destructive: "bg-red-500/10 text-red-400 border border-red-500/20",
};
export function Badge({ variant = "default", className, children }: { variant?: V; className?: string; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium", vs[variant], className)}>{children}</span>;
}
