import React from "react";
import { GalleryStage } from "../components/GalleryStage";
import { MediaFrame } from "../components/MediaFrame";
import {
  FeatureGridSection,
  type FeatureGridItem,
} from "../sections/FeatureGridSection";
import { HeroSection, type HeroSectionAction } from "../sections/HeroSection";

export interface ProductShowcasePageProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: HeroSectionAction[];
  featureItems?: FeatureGridItem[];
  heading?: React.ReactNode;
  mediaAlt?: string;
  mediaSrc?: string;
}

const defaultActions: HeroSectionAction[] = [
  { label: "Read docs", variant: "default" },
  { label: "Install template", variant: "secondary" },
];

const defaultFeatures: FeatureGridItem[] = [
  {
    id: "one",
    title: "Section presets",
    description:
      "Pre-composed page sections for launch, product, and documentation surfaces.",
  },
  {
    id: "two",
    title: "Visual consistency",
    description:
      "Profiles and themes map directly to CSS variables used in every template.",
  },
  {
    id: "three",
    title: "MCP delivery",
    description:
      "Fetch source bundles from a single endpoint and apply in other repositories.",
  },
];

/**
 * ProductShowcasePage - balanced page scaffold for product and release content.
 */
export const ProductShowcasePage = React.forwardRef<
  HTMLDivElement,
  ProductShowcasePageProps
>(
  (
    {
      actions = defaultActions,
      className = "",
      featureItems = defaultFeatures,
      heading = "Product showcase",
      mediaAlt = "Product preview",
      mediaSrc,
      ...props
    },
    ref,
  ) => {
    const classes = [
      "min-h-screen [background:var(--vde-color-background)] [color:var(--vde-color-foreground)]",
      className,
    ].join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        data-vde-component="page-product-showcase"
        {...props}
      >
        <HeroSection
          heading={heading}
          subtitle="A reference page built from installable section primitives."
          actions={actions}
        />

        {/*
          Was Layout > GalleryStage > MediaFrame — three surfaces, each drawing its
          own border and ambient shadow, so the media sat inside three concentric
          frames. The stage is the surface now; the frame inside it is just a crop.
        */}
        <GalleryStage className="mx-auto mt-8 max-w-6xl [padding:var(--vde-space-lg)]">
          <MediaFrame
            className="aspect-[16/9] border-0 shadow-none"
            src={mediaSrc}
            alt={mediaAlt}
          />
        </GalleryStage>

        <FeatureGridSection
          className="mt-10"
          items={featureItems}
          sectionTitle="Everything stays composable"
        />
      </div>
    );
  },
);

ProductShowcasePage.displayName = "ProductShowcasePage";
