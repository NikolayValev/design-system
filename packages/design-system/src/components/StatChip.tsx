import React from 'react';

export interface StatChipProps extends React.HTMLAttributes<HTMLLIElement> {
  label: React.ReactNode;
  value: React.ReactNode;
}

/**
 * StatChip - compact metric token component.
 */
export const StatChip = React.forwardRef<HTMLLIElement, StatChipProps>(
  ({ className = '', label, value, ...props }, ref) => {
    const classes = [
      'list-none',
      'border',
      '[border-color:var(--vde-color-border)]',
      '[border-width:var(--vde-border-width)]',
      '[border-radius:var(--vde-boundary-radius)]',
      '[background:var(--vde-color-surface)]',
      '[color:var(--vde-color-surface-foreground)]',
      '[box-shadow:var(--vde-shadow-ambient)]',
      'px-4',
      'py-3',
      className,
    ].join(' ');

    return (
      <li ref={ref} className={classes} {...props}>
        <p className="text-xs uppercase tracking-[0.16em] [color:var(--vde-color-muted-foreground)] [font-family:var(--vde-font-mono)]">
          {label}
        </p>
        <p className="mt-2 text-xl font-semibold [font-family:var(--vde-font-display)] [line-height:var(--vde-line-height-tight)]">
          {value}
        </p>
      </li>
    );
  },
);

StatChip.displayName = 'StatChip';
