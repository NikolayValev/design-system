import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
  children: React.ReactNode;
}

const baseClasses = [
  "inline-flex",
  "items-center",
  "gap-1",
  "border",
  "font-medium",
  "whitespace-nowrap",
  "align-middle",
  "[padding-inline:var(--vde-space-xs)]",
  "[padding-block:var(--vde-space-2xs)]",
  // Was `text-xs` (12px). Badges routinely carry status a user has to read, and
  // several are rendered inside links and buttons, so they sit on the interactive
  // floor rather than below it.
  "[font-size:var(--vde-font-size-ui)]",
  "[line-height:var(--vde-line-height-ui)]",
  "[border-width:var(--vde-border-width)]",
  "[border-radius:var(--vde-radius-pill)]",
  "[font-family:var(--vde-font-body)]",
  "[letter-spacing:var(--vde-letter-spacing-wide)]",
];

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "bg-[var(--vde-color-accent)] text-[var(--vde-color-accent-foreground)] border-transparent",
  secondary:
    "bg-[var(--vde-color-secondary)] text-[var(--vde-color-secondary-foreground)] border-transparent",
  outline:
    "bg-transparent text-[var(--vde-color-foreground)] [border-color:var(--vde-color-border)]",
  destructive:
    "bg-[var(--vde-color-danger)] text-[var(--vde-color-danger-foreground)] border-transparent",
};

/**
 * Badge — compact, token-driven status/label chip.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className = "", ...props }, ref) => {
    const classes = [...baseClasses, variantClasses[variant], className].join(
      " ",
    );
    return <span ref={ref} className={classes} {...props} />;
  },
);

Badge.displayName = "Badge";
