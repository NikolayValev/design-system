import React from "react";

export interface SectionShellProps extends React.HTMLAttributes<HTMLElement> {
  actions?: React.ReactNode;
  constrained?: boolean;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  heading?: React.ReactNode;
}

/**
 * SectionShell - shared section scaffold for page-level composition.
 *
 * The `eyebrow` slot is deliberately opt-in and unstyled-by-default-loud. It used
 * to render at 12px, uppercase, wide-tracked and muted whenever it was present —
 * and every section and page template supplied a default string, so the whole
 * library shipped a small all-caps label above every heading. That single pattern
 * tripped four separate quality rules at once (tiny interface text, all-caps runs,
 * a label competing with the heading below it, and placeholder marketing copy).
 *
 * It now renders at the caption step in sentence case. Pass an eyebrow when the
 * section genuinely needs a kicker; omit it when the heading can stand alone,
 * which is most of the time.
 */
export const SectionShell = React.forwardRef<HTMLElement, SectionShellProps>(
  (
    {
      actions,
      children,
      className = "",
      constrained = true,
      description,
      eyebrow,
      heading,
      ...props
    },
    ref,
  ) => {
    const classes = [
      "w-full",
      "border-b",
      "[border-color:var(--vde-color-border)]",
      "[padding-block:clamp(2.5rem,_8vw,_6rem)]",
      className,
    ].join(" ");

    const innerClasses = [
      constrained ? "mx-auto w-full max-w-6xl" : "w-full",
      "[padding-inline:clamp(1rem,_4vw,_2rem)]",
      "space-y-6",
    ].join(" ");

    return (
      <section ref={ref} className={classes} {...props}>
        <div className={innerClasses}>
          {eyebrow ? (
            <p className="[font-size:var(--vde-font-size-caption)] [letter-spacing:var(--vde-letter-spacing-wide)] [line-height:var(--vde-line-height-ui)] [color:var(--vde-color-muted-foreground)] [font-family:var(--vde-font-mono)]">
              {eyebrow}
            </p>
          ) : null}

          {heading ? (
            <h2 className="font-semibold [font-size:var(--vde-font-size-headline)] [font-family:var(--vde-font-display)] [line-height:var(--vde-line-height-tight)] [letter-spacing:var(--vde-letter-spacing-tight)]">
              {heading}
            </h2>
          ) : null}

          {description ? (
            <p className="[max-width:var(--vde-measure)] [font-size:var(--vde-font-size-body)] [color:var(--vde-color-muted-foreground)] [line-height:var(--vde-line-height-relaxed)] md:[font-size:var(--vde-font-size-lead)]">
              {description}
            </p>
          ) : null}

          {actions ? (
            <div className="flex flex-wrap items-center gap-3">{actions}</div>
          ) : null}

          {children}
        </div>
      </section>
    );
  },
);

SectionShell.displayName = "SectionShell";
