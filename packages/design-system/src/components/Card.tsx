import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Card component - semantic container with token-driven styling
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    const classes = [
      'rounded-lg',
      'border',
      'border-border',
      'bg-card',
      'text-card-foreground',
      'shadow-sm',
      className,
    ].join(' ');

    return <div ref={ref} className={classes} {...props} />;
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', ...props }, ref) => {
    const classes = ['flex', 'flex-col', 'space-y-1.5', 'p-md', className].join(' ');
    return <div ref={ref} className={classes} {...props} />;
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', ...props }, ref) => {
    const classes = ['text-2xl', 'font-semibold', 'leading-none', 'tracking-tight', className].join(' ');
    return <h3 ref={ref} className={classes} {...props} />;
  }
);

CardTitle.displayName = 'CardTitle';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', ...props }, ref) => {
    const classes = ['p-md', 'pt-0', className].join(' ');
    return <div ref={ref} className={classes} {...props} />;
  }
);

CardContent.displayName = 'CardContent';
