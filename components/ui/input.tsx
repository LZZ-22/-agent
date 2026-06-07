import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; }

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label htmlFor={id} className="block text-xs font-medium text-[var(--color-foreground-dim)]">{label}</label>}
      <input ref={ref} id={id} className={cn(
        "flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:border-[var(--color-border-glow)] disabled:opacity-40 transition-all",
        error && "border-[var(--color-destructive)]", className
      )} {...props} />
      {error && <p className="text-xs text-[var(--color-destructive)]">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";
