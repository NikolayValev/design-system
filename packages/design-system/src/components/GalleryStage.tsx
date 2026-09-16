import React from 'react';
import { useVision } from '../vde-core';
import { AestheticOrnaments } from './AestheticOrnaments';

export interface GalleryStageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  material?: 'adaptive' | 'paper' | 'slab' | 'glass';
}

function resolveMaterial(visionId: string, material: NonNullable<GalleryStageProps['material']>): 'paper' | 'slab' | 'glass' {
  if (material !== 'adaptive') {
    return material;
  }

  if (visionId === 'museum') {
    return 'paper';
  }

  if (visionId === 'brutalist' || visionId === 'swiss_international') {
    return 'slab';
  }

  return 'glass';
}

export const GalleryStage = React.forwardRef<HTMLDivElement, GalleryStageProps>(
  ({ className = '', children, material = 'adaptive', ...props }, ref) => {
    const { activeVision } = useVision();
    const resolvedMaterial = resolveMaterial(activeVision.id, material);

    const classes = [
      'relative',
      'isolate',
      'overflow-hidden',
      'border',
      resolvedMaterial === 'glass'
        ? '[background:var(--vde-gallery-glass-background,_color-mix(in_oklab,_var(--vde-color-surface)_78%,_transparent))]'
        : '[background:var(--vde-gallery-material-background,_var(--vde-color-surface))]',
      '[border-color:var(--vde-color-border)]',
      '[border-width:var(--vde-border-width)]',
      '[border-radius:var(--vde-radius-surface)]',
      '[color:var(--vde-color-surface-foreground)]',
      // All three of these were per-theme branches with hardcoded fallbacks — a raw
      // `#000` offset and a 20px blur. The tokens already default to the neutral
      // value (ambient shadow, 0px blur), so the branches were doing nothing the
      // cascade was not already doing.
      '[box-shadow:var(--vde-gallery-offset-shadow)]',
      '[backdrop-filter:blur(var(--vde-gallery-backdrop-blur))]',
      '[-webkit-backdrop-filter:blur(var(--vde-gallery-backdrop-blur))]',
      // Was `transition-all`, which animates layout properties too.
      '[transition-property:background-color,border-color,box-shadow,backdrop-filter]',
      '[transition-duration:var(--vde-motion-duration-normal)]',
      '[transition-timing-function:var(--vde-motion-easing-standard)]',
      className,
    ].join(' ');

    return (
      <section ref={ref} className={classes} data-vde-component="gallery-stage" {...props}>
        <AestheticOrnaments />
        {/* Paper overlay — opacity token is 0 in every vision that does not want it. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] [background-image:var(--vde-surface-texture)] [opacity:var(--vde-gallery-paper-overlay-opacity)]"
        />
        {/*
          The halo was two hardcoded purple/cyan literals behind an `isImmersive`
          branch. It is now a token that resolves to `none` everywhere except the
          visions that ask for it, and the colour is mixed from the live palette
          rather than fixed, so it tracks whatever accent the theme sets.
        */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] [background:var(--vde-gallery-halo)]"
        />
        <div className="relative z-10">{children}</div>
      </section>
    );
  }
);

GalleryStage.displayName = 'GalleryStage';
