import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Input component - form primitive with token-driven styling
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', ...props }, ref) => {
    const classes = [
      'flex',
      'h-10',
      'w-full',
      'border',
      'px-3',
      'py-2',
      'text-sm',
      'ring-offset-background',
      'file:border-0',
      'file:bg-transparent',
      'file:text-sm',
      'file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50',
      '[border-radius:var(--vde-boundary-radius)]',
      '[border-width:var(--vde-border-width)]',
      '[border-color:var(--vde-color-input)]',
      '[background:var(--vde-color-background)]',
      '[color:var(--vde-color-foreground)]',
      '[font-family:var(--vde-font-body)]',
      '[line-height:var(--vde-line-height-normal)]',
      '[letter-spacing:var(--vde-letter-spacing-normal)]',
      'transition-all',
      '[transition-duration:var(--vde-motion-duration-fast)]',
      '[transition-timing-function:var(--vde-motion-easing-standard)]',
      className,
    ].join(' ');

    return <input ref={ref} type={type} className={classes} {...props} />;
  }
);

Input.displayName = 'Input';
