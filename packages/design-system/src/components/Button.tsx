import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * Button component - reads from CSS variables, never hardcoded colors
 * 
 * @example
 * ```tsx
 * <Button variant="default" size="md">Click me</Button>
 * <Button variant="destructive">Delete</Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'md', className = '', ...props }, ref) => {
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'transition-all',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
    ];

    const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
      default: 'hover:opacity-90',
      secondary: 'hover:opacity-90',
      destructive: 'hover:opacity-90',
      outline: 'hover:bg-muted',
      ghost: 'hover:bg-muted',
    };

    const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8 text-lg',
    };

    const variantTokenClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
      default: 'bg-[var(--vde-color-accent)] text-[var(--vde-color-accent-foreground)] border-transparent',
      secondary: 'bg-[var(--vde-color-secondary)] text-[var(--vde-color-secondary-foreground)] border-transparent',
      destructive: 'bg-[var(--vde-color-danger)] text-[var(--vde-color-danger-foreground)] border-transparent',
      outline: 'bg-transparent text-[var(--vde-color-foreground)] border-[var(--vde-color-border)]',
      ghost: 'bg-transparent text-[var(--vde-color-foreground)] border-transparent',
    };

    const classes = [
      ...baseClasses,
      'border',
      '[border-width:var(--vde-border-width)]',
      '[border-radius:var(--vde-boundary-radius)]',
      '[box-shadow:var(--vde-shadow-ambient)]',
      '[font-family:var(--vde-font-body)]',
      '[letter-spacing:var(--vde-letter-spacing-normal)]',
      '[line-height:var(--vde-line-height-tight)]',
      '[transition-duration:var(--vde-motion-duration-fast)]',
      '[transition-timing-function:var(--vde-motion-easing-standard)]',
      variantClasses[variant],
      variantTokenClasses[variant],
      sizeClasses[size],
      className,
    ].join(' ');

    return <button ref={ref} className={classes} {...props} />;
  }
);

Button.displayName = 'Button';
