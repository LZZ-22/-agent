import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; size?: Size; }

const v: Record<Variant, string> = {
  default: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]",
  outline: "border border-[var(--color-border)] hover:bg-[var(--color-muted)]",
  ghost: "hover:bg-[var(--color-muted)]",
  destructive: "bg-[var(--color-destructive)] text-white hover:bg-red-600",
};
const s: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button ref={ref} className={cn(
      "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-md)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-50 cursor-pointer",
      v[variant], s[size], className
    )} {...props} />
  )
);
Button.displayName = "Button";
