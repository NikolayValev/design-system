import React from 'react';
import { FeatureTile } from '../components/FeatureTile';
import { SectionShell } from '../components/SectionShell';

export interface FeatureGridItem {
  description: React.ReactNode;
  icon?: React.ReactNode;
  id: string;
  title: React.ReactNode;
}

export interface FeatureGridSectionProps extends React.HTMLAttributes<HTMLElement> {
  items: FeatureGridItem[];
  sectionDescription?: React.ReactNode;
  sectionEyebrow?: React.ReactNode;
  sectionTitle?: React.ReactNode;
}

/**
 * FeatureGridSection - responsive section for value proposition blocks.
 */
export const FeatureGridSection = React.forwardRef<HTMLElement, FeatureGridSectionProps>(
  (
    {
      className = '',
      items,
      sectionDescription = 'Composable building blocks that inherit your active token profile.',
      sectionEyebrow = 'Capabilities',
      sectionTitle = 'Production-ready sections',
      ...props
    },
    ref,
  ) => {
    return (
      <SectionShell
        ref={ref}
        className={className}
        data-vde-component="section-feature-grid"
        description={sectionDescription}
        eyebrow={sectionEyebrow}
        heading={sectionTitle}
        {...props}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map(item => (
            <FeatureTile key={item.id} icon={item.icon} summary={item.description} heading={item.title} />
          ))}
        </div>
      </SectionShell>
    );
  },
);

FeatureGridSection.displayName = 'FeatureGridSection';
