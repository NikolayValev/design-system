import React from 'react';

export interface FeatureTileProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: React.ReactNode;
  icon?: React.ReactNode;
  summary: React.ReactNode;
}

/**
 * FeatureTile - presentational block for feature grids and section highlights.
 */
export const FeatureTile = React.forwardRef<HTMLDivElement, FeatureTileProps>(
  ({ className = '', heading, icon, summary, ...props }, ref) => {
    const classes = [
      'group',
      'relative',
      'overflow-hidden',
      'border',
      '[border-color:var(--vde-color-border)]',
      '[border-width:var(--vde-border-width)]',
      '[border-radius:var(--vde-boundary-radius)]',
      '[background:var(--vde-color-surface)]',
      '[color:var(--vde-color-surface-foreground)]',
      '[box-shadow:var(--vde-shadow-ambient)]',
      'p-6',
      'transition-all',
      '[transition-duration:var(--vde-motion-duration-normal)]',
      '[transition-timing-function:var(--vde-motion-easing-standard)]',
      'hover:-translate-y-1',
      className,
    ].join(' ');

    return (
      <article ref={ref} className={classes} {...props}>
        {icon ? (
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border [border-color:var(--vde-color-border)] [background:var(--vde-color-background)] [color:var(--vde-color-accent)]">
            {icon}
          </div>
        ) : null}

        <h3 className="text-xl font-semibold [font-family:var(--vde-font-display)] [line-height:var(--vde-line-height-tight)]">
          {heading}
        </h3>

        <p className="mt-3 text-sm [color:var(--vde-color-muted-foreground)] [line-height:var(--vde-line-height-relaxed)] md:text-base">
          {summary}
        </p>
      </article>
    );
  },
);

FeatureTile.displayName = 'FeatureTile';
