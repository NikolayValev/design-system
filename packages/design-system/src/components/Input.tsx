import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const inputClasses = [
  'flex',
  'h-10',
  'w-full',
  'min-w-0',
  'border',
  'px-3',
  'py-2',
  'text-sm',
  '[border-width:var(--vde-border-width)]',
  '[border-radius:var(--vde-boundary-radius)]',
  '[border-color:var(--vde-color-input)]',
  '[background:var(--vde-color-background)]',
  '[color:var(--vde-color-foreground)]',
  '[font-family:var(--vde-font-body)]',
  '[line-height:var(--vde-line-height-normal)]',
  '[letter-spacing:var(--vde-letter-spacing-normal)]',
  'placeholder:[color:var(--vde-color-muted-foreground)]',
  'file:border-0',
  'file:bg-transparent',
  'file:text-sm',
  'file:font-medium',
  'file:[color:var(--vde-color-foreground)]',
  'transition-[border-color,box-shadow,color]',
  '[transition-duration:var(--vde-motion-duration-fast)]',
  '[transition-timing-function:var(--vde-motion-easing-standard)]',
  'hover:[border-color:var(--vde-color-border)]',
  'focus-visible:[outline:2px_solid_var(--vde-color-ring)]',
  'focus-visible:[outline-offset:2px]',
  'focus-visible:[border-color:var(--vde-color-ring)]',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
  'aria-[invalid=true]:[border-color:var(--vde-color-danger)]',
  'aria-[invalid=true]:focus-visible:[outline-color:var(--vde-color-danger)]',
].join(' ');

/**
 * Input — token-driven form field with hover, focus-visible, disabled, and
 * `aria-invalid` states. Reads only `--vde-*` variables.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', ...props }, ref) => {
    const classes = [inputClasses, className].join(' ');
    return <input ref={ref} type={type} className={classes} {...props} />;
  }
);

Input.displayName = 'Input';
