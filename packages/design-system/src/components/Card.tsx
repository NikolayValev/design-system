import React from 'react';
import { AestheticOrnaments } from './AestheticOrnaments';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Card component - semantic container with token-driven styling
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, ...props }, ref) => {
    const classes = [
      'relative',
      'overflow-hidden',
      'border',
      'bg-[var(--vde-color-surface)]',
      'text-[var(--vde-color-surface-foreground)]',
      '[border-color:var(--vde-color-border)]',
      '[border-width:var(--vde-border-width)]',
      '[border-radius:var(--vde-boundary-radius)]',
      '[box-shadow:var(--vde-shadow-ambient)]',
      '[font-family:var(--vde-font-body)]',
      'transition-all',
      '[transition-duration:var(--vde-motion-duration-normal)]',
      '[transition-timing-function:var(--vde-motion-easing-standard)]',
      className,
    ].join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        <AestheticOrnaments />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', ...props }, ref) => {
    const classes = ['flex', 'flex-col', 'space-y-1.5', '[padding:calc(var(--vde-typography-scale-body)*1rem)]', className].join(' ');
    return <div ref={ref} className={classes} {...props} />;
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', ...props }, ref) => {
    const classes = [
      'text-2xl',
      'font-semibold',
      '[font-family:var(--vde-font-display)]',
      '[line-height:var(--vde-line-height-tight)]',
      '[letter-spacing:var(--vde-letter-spacing-tight)]',
      className,
    ].join(' ');
    return <h3 ref={ref} className={classes} {...props} />;
  }
);

CardTitle.displayName = 'CardTitle';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', ...props }, ref) => {
    const classes = [
      '[padding:calc(var(--vde-typography-scale-body)*1rem)]',
      '[padding-top:0]',
      '[line-height:var(--vde-line-height-normal)]',
      className,
    ].join(' ');
    return <div ref={ref} className={classes} {...props} />;
  }
);

CardContent.displayName = 'CardContent';
