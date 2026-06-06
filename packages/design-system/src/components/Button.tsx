import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Shows a spinner, sets `aria-busy`, and blocks interaction. */
  loading?: boolean;
  children: React.ReactNode;
}

const baseClasses = [
  'relative',
  'inline-flex',
  'items-center',
  'justify-center',
  'gap-2',
  'font-medium',
  'select-none',
  'whitespace-nowrap',
  'align-middle',
  'cursor-pointer',
  'border',
  '[border-width:var(--vde-border-width)]',
  '[border-radius:var(--vde-boundary-radius)]',
  '[font-family:var(--vde-font-body)]',
  '[letter-spacing:var(--vde-letter-spacing-normal)]',
  '[line-height:var(--vde-line-height-tight)]',
  'transition-[background-color,border-color,color,box-shadow,transform,filter]',
  '[transition-duration:var(--vde-motion-duration-fast)]',
  '[transition-timing-function:var(--vde-motion-easing-standard)]',
  'focus-visible:[outline:2px_solid_var(--vde-color-ring)]',
  'focus-visible:[outline-offset:2px]',
  'active:translate-y-px',
  'disabled:pointer-events-none',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
];

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: [
    'bg-[var(--vde-color-accent)]',
    'text-[var(--vde-color-accent-foreground)]',
    'border-transparent',
    '[box-shadow:var(--vde-shadow-ambient)]',
    'hover:[background:color-mix(in_oklab,var(--vde-color-accent)_88%,var(--vde-color-foreground))]',
  ].join(' '),
  secondary: [
    'bg-[var(--vde-color-secondary)]',
    'text-[var(--vde-color-secondary-foreground)]',
    'border-transparent',
    '[box-shadow:var(--vde-shadow-ambient)]',
    'hover:[background:color-mix(in_oklab,var(--vde-color-secondary)_88%,var(--vde-color-foreground))]',
  ].join(' '),
  destructive: [
    'bg-[var(--vde-color-danger)]',
    'text-[var(--vde-color-danger-foreground)]',
    'border-transparent',
    '[box-shadow:var(--vde-shadow-ambient)]',
    'hover:[background:color-mix(in_oklab,var(--vde-color-danger)_88%,var(--vde-color-foreground))]',
  ].join(' '),
  outline: [
    'bg-transparent',
    'text-[var(--vde-color-foreground)]',
    '[border-color:var(--vde-color-border)]',
    'hover:[background:var(--vde-color-muted)]',
  ].join(' '),
  ghost: [
    'bg-transparent',
    'text-[var(--vde-color-foreground)]',
    'border-transparent',
    'hover:[background:var(--vde-color-muted)]',
  ].join(' '),
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 gap-1.5 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
};

function Spinner(): JSX.Element {
  return (
    <svg
      className="h-4 w-4 shrink-0 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  );
}

/**
 * Button — token-driven styling with consistent hover, active, focus-visible,
 * disabled, and loading states. Reads only `--vde-*` variables; no per-theme
 * branches. Defaults to `type="button"` to avoid accidental form submission.
 *
 * @example
 * ```tsx
 * <Button variant="default" size="md">Save</Button>
 * <Button variant="destructive" loading>Deleting…</Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      loading = false,
      disabled,
      type = 'button',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      ...baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Spinner /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
