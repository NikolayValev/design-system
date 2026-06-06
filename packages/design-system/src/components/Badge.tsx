import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  children: React.ReactNode;
}

const baseClasses = [
  'inline-flex',
  'items-center',
  'gap-1',
  'border',
  'px-2.5',
  'py-0.5',
  'text-xs',
  'font-medium',
  'whitespace-nowrap',
  'align-middle',
  '[border-width:var(--vde-border-width)]',
  '[border-radius:var(--vde-boundary-radius)]',
  '[font-family:var(--vde-font-body)]',
  '[letter-spacing:var(--vde-letter-spacing-wide)]',
];

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-[var(--vde-color-accent)] text-[var(--vde-color-accent-foreground)] border-transparent',
  secondary:
    'bg-[var(--vde-color-secondary)] text-[var(--vde-color-secondary-foreground)] border-transparent',
  outline: 'bg-transparent text-[var(--vde-color-foreground)] [border-color:var(--vde-color-border)]',
  destructive: 'bg-[var(--vde-color-danger)] text-[var(--vde-color-danger-foreground)] border-transparent',
};

/**
 * Badge — compact, token-driven status/label chip.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className = '', ...props }, ref) => {
    const classes = [...baseClasses, variantClasses[variant], className].join(' ');
    return <span ref={ref} className={classes} {...props} />;
  }
);

Badge.displayName = 'Badge';
