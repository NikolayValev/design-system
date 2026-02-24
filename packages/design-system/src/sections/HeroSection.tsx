import React from 'react';
import { Button } from '../components/Button';
import { EditorialHeader } from '../components/EditorialHeader';
import { SectionShell } from '../components/SectionShell';

export interface HeroSectionAction {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
}

export interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  actions?: HeroSectionAction[];
  heading: React.ReactNode;
  eyebrow?: React.ReactNode;
  subtitle?: React.ReactNode;
}

/**
 * HeroSection - high-impact intro section with token-driven actions.
 */
export const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  ({ actions = [], className = '', eyebrow, subtitle, heading, ...props }, ref) => {
    return (
      <SectionShell
        ref={ref}
        className={className}
        data-vde-component="section-hero"
        eyebrow={eyebrow ?? 'Launch faster'}
        heading={<EditorialHeader as="h1" size="massive">{heading}</EditorialHeader>}
        description={subtitle}
        actions={
          actions.length > 0 ? (
            <>
              {actions.map(action => {
                return (
                  <Button key={action.label} onClick={action.onClick} variant={action.variant ?? 'default'}>
                    {action.label}
                  </Button>
                );
              })}
            </>
          ) : undefined
        }
        {...props}
      />
    );
  },
);

HeroSection.displayName = 'HeroSection';
