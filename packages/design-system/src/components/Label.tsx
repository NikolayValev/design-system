import React from 'react';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const labelClasses = [
  'inline-flex',
  'items-center',
  'gap-2',
  'text-sm',
  'font-medium',
  'select-none',
  '[font-family:var(--vde-font-body)]',
  '[color:var(--vde-color-foreground)]',
  '[line-height:var(--vde-line-height-tight)]',
].join(' ');

/**
 * Label — token-driven form label. Pair with an `htmlFor` target or wrap a
 * control directly.
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', ...props }, ref) => {
    const classes = [labelClasses, className].join(' ');
    return <label ref={ref} className={classes} {...props} />;
  }
);

Label.displayName = 'Label';
