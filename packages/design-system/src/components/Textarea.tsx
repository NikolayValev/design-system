import React from 'react';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const textareaClasses = [
  'flex',
  'min-h-20',
  'w-full',
  'min-w-0',
  'border',
  'px-3',
  'py-2',
  'text-sm',
  'resize-y',
  '[border-width:var(--vde-border-width)]',
  '[border-radius:var(--vde-boundary-radius)]',
  '[border-color:var(--vde-color-input)]',
  '[background:var(--vde-color-background)]',
  '[color:var(--vde-color-foreground)]',
  '[font-family:var(--vde-font-body)]',
  '[line-height:var(--vde-line-height-normal)]',
  '[letter-spacing:var(--vde-letter-spacing-normal)]',
  'placeholder:[color:var(--vde-color-muted-foreground)]',
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
 * Textarea — multi-line counterpart to {@link Input}, sharing its state model.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    const classes = [textareaClasses, className].join(' ');
    return <textarea ref={ref} className={classes} {...props} />;
  }
);

Textarea.displayName = 'Textarea';
