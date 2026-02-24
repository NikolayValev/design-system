import React from 'react';
import { AtmosphereProvider } from '../components/AtmosphereProvider';
import { FeatureGridSection, type FeatureGridItem } from '../sections/FeatureGridSection';
import { HeroSection, type HeroSectionAction } from '../sections/HeroSection';
import { MetricStripSection, type MetricSectionItem } from '../sections/MetricStripSection';

export interface MarketingLandingPageProps extends React.HTMLAttributes<HTMLDivElement> {
  ctaActions?: HeroSectionAction[];
  featureItems?: FeatureGridItem[];
  heading?: React.ReactNode;
  metricItems?: MetricSectionItem[];
  subtitle?: React.ReactNode;
}

const defaultActions: HeroSectionAction[] = [
  { label: 'Start trial', variant: 'default' },
  { label: 'Talk to sales', variant: 'outline' },
];

const defaultFeatures: FeatureGridItem[] = [
  {
    id: 'installable',
    title: 'Installable source',
    description: 'Drop components into your repo with MCP and keep full ownership of implementation.',
  },
  {
    id: 'tokenized',
    title: 'Token-powered styling',
    description: 'All sections and pages stay aligned with @nikolayvalev/design-tokens.',
  },
  {
    id: 'composable',
    title: 'Composable sections',
    description: 'Build landing pages from reusable section templates with minimal overrides.',
  },
];

const defaultMetrics: MetricSectionItem[] = [
  { id: 'a', label: 'Deployment time', value: '< 5m' },
  { id: 'b', label: 'Token profile switch', value: '1 import' },
  { id: 'c', label: 'Section reuse', value: 'Cross-repo' },
];

/**
 * MarketingLandingPage - ready-to-install page composition using section templates.
 */
export const MarketingLandingPage = React.forwardRef<HTMLDivElement, MarketingLandingPageProps>(
  ({
    className = '',
    ctaActions = defaultActions,
    featureItems = defaultFeatures,
    heading = 'Ship branded product surfaces quickly',
    metricItems = defaultMetrics,
    subtitle = 'A token-driven foundation with installable components, sections, and pages.',
    ...props
  },
  ref,
) => {
    const classes = ['min-h-screen [background:var(--vde-color-background)] [color:var(--vde-color-foreground)]', className].join(
      ' ',
    );

    return (
      <div ref={ref} className={classes} data-vde-component="page-marketing-landing" {...props}>
        <AtmosphereProvider intensity="soft">
          <HeroSection heading={heading} subtitle={subtitle} actions={ctaActions} />
          <FeatureGridSection items={featureItems} />
          <MetricStripSection items={metricItems} sectionEyebrow="Outcomes" sectionTitle="Why teams adopt this model" />
        </AtmosphereProvider>
      </div>
    );
  },
);

MarketingLandingPage.displayName = 'MarketingLandingPage';
