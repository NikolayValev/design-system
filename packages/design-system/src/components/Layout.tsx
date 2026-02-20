import React from 'react';
import { AestheticOrnaments } from './AestheticOrnaments';

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  heading?: string;
}

export const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className = '', children, heading, ...props }, ref) => {
    const classes = [
      'relative',
      'overflow-hidden',
      'border',
      'transition-all',
      '[border-radius:var(--vde-boundary-radius)]',
      '[border-width:var(--vde-border-width)]',
      '[border-color:var(--vde-color-border)]',
      '[background:var(--vde-color-background)]',
      '[color:var(--vde-color-foreground)]',
      '[padding:calc(var(--vde-typography-scale-body)*1.5rem)]',
      '[box-shadow:var(--vde-shadow-ambient)]',
      '[backdrop-filter:blur(var(--vde-surface-blur))]',
      '[transition-duration:var(--vde-motion-duration-normal)]',
      '[transition-timing-function:var(--vde-motion-easing-standard)]',
      '[font-family:var(--vde-font-body)]',
      className,
    ].join(' ');

    return (
      <section ref={ref} className={classes} {...props}>
        <AestheticOrnaments />
        <div className="relative z-10">
          {heading ? (
            <h2 className="mb-4 [font-family:var(--vde-font-display)] [line-height:var(--vde-line-height-tight)] [letter-spacing:var(--vde-letter-spacing-tight)] [font-size:calc(1.25rem*var(--vde-typography-scale-display))]">
              {heading}
            </h2>
          ) : null}
          {children}
        </div>
      </section>
    );
  }
);

Layout.displayName = 'Layout';
