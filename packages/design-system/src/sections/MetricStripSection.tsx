import React from 'react';
import { StatChip } from '../components/StatChip';
import { SectionShell } from '../components/SectionShell';

export interface MetricSectionItem {
  id: string;
  label: React.ReactNode;
  value: React.ReactNode;
}

export interface MetricStripSectionProps extends React.HTMLAttributes<HTMLElement> {
  items: MetricSectionItem[];
  sectionDescription?: React.ReactNode;
  sectionEyebrow?: React.ReactNode;
  sectionTitle?: React.ReactNode;
}

/**
 * MetricStripSection - dense KPI rail for product and pricing pages.
 */
export const MetricStripSection = React.forwardRef<HTMLElement, MetricStripSectionProps>(
  (
    {
      className = '',
      items,
      sectionDescription = 'Single-row or wrapped metric summaries for launch pages.',
      sectionEyebrow = 'Signal',
      sectionTitle = 'Core metrics at a glance',
      ...props
    },
    ref,
  ) => {
    return (
      <SectionShell
        ref={ref}
        className={className}
        data-vde-component="section-metric-strip"
        description={sectionDescription}
        eyebrow={sectionEyebrow}
        heading={sectionTitle}
        {...props}
      >
        <ul className="grid grid-cols-1 gap-3 p-0 md:grid-cols-3">
          {items.map(item => (
            <StatChip key={item.id} label={item.label} value={item.value} />
          ))}
        </ul>
      </SectionShell>
    );
  },
);

MetricStripSection.displayName = 'MetricStripSection';
