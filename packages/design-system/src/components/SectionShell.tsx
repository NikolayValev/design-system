import React from 'react';

export interface SectionShellProps extends React.HTMLAttributes<HTMLElement> {
  actions?: React.ReactNode;
  constrained?: boolean;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  heading?: React.ReactNode;
}

/**
 * SectionShell - shared section scaffold for page-level composition.
 */
export const SectionShell = React.forwardRef<HTMLElement, SectionShellProps>(
  (
    {
      actions,
      children,
      className = '',
      constrained = true,
      description,
      eyebrow,
      heading,
      ...props
    },
    ref,
  ) => {
    const classes = [
      'w-full',
      'border-b',
      '[border-color:var(--vde-color-border)]',
      '[padding-block:clamp(2.5rem,_8vw,_6rem)]',
      className,
    ].join(' ');

    const innerClasses = [
      constrained ? 'mx-auto w-full max-w-6xl' : 'w-full',
      '[padding-inline:clamp(1rem,_4vw,_2rem)]',
      'space-y-6',
    ].join(' ');

    return (
      <section ref={ref} className={classes} {...props}>
        <div className={innerClasses}>
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.18em] [color:var(--vde-color-muted-foreground)] [font-family:var(--vde-font-mono)]">
              {eyebrow}
            </p>
          ) : null}

          {heading ? (
            <h2 className="text-3xl font-semibold [font-family:var(--vde-font-display)] [line-height:var(--vde-line-height-tight)] [letter-spacing:var(--vde-letter-spacing-tight)] md:text-5xl">
              {heading}
            </h2>
          ) : null}

          {description ? (
            <p className="max-w-3xl text-base [color:var(--vde-color-muted-foreground)] [line-height:var(--vde-line-height-relaxed)] md:text-lg">
              {description}
            </p>
          ) : null}

          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}

          {children}
        </div>
      </section>
    );
  },
);

SectionShell.displayName = 'SectionShell';
