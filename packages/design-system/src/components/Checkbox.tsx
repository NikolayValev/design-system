import React from 'react';

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

const checkboxClasses = [
  'h-4',
  'w-4',
  'shrink-0',
  'cursor-pointer',
  'align-middle',
  '[accent-color:var(--vde-color-accent)]',
  'transition-[box-shadow]',
  '[transition-duration:var(--vde-motion-duration-fast)]',
  '[transition-timing-function:var(--vde-motion-easing-standard)]',
  'focus-visible:[outline:2px_solid_var(--vde-color-ring)]',
  'focus-visible:[outline-offset:2px]',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
].join(' ');

/**
 * Checkbox — native checkbox styled through `accent-color` so it stays fully
 * accessible while inheriting the active theme's accent and focus ring.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', ...props }, ref) => {
    const classes = [checkboxClasses, className].join(' ');
    return <input ref={ref} type="checkbox" className={classes} {...props} />;
  }
);

Checkbox.displayName = 'Checkbox';
