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
    const isMuseum = activeVision.id === 'museum';
    const isBrutalist = activeVision.id === 'brutalist';
    const isImmersive = activeVision.id === 'immersive';

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
      '[border-radius:var(--vde-boundary-radius)]',
      '[color:var(--vde-color-surface-foreground)]',
      isBrutalist ? '[box-shadow:var(--vde-gallery-offset-shadow,_4px_4px_0_0_#000)]' : '[box-shadow:var(--vde-shadow-ambient)]',
      isImmersive ? '[backdrop-filter:blur(var(--vde-gallery-backdrop-blur,_20px))]' : '[backdrop-filter:none]',
      isImmersive ? '[-webkit-backdrop-filter:blur(var(--vde-gallery-backdrop-blur,_20px))]' : '[-webkit-backdrop-filter:none]',
      'transition-all',
      '[transition-duration:var(--vde-motion-duration-normal)]',
      '[transition-timing-function:var(--vde-motion-easing-standard)]',
      className,
    ].join(' ');

    return (
      <section ref={ref} className={classes} data-vde-component="gallery-stage" {...props}>
        <AestheticOrnaments />
        {isMuseum ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] [background-image:var(--vde-surface-texture)] [opacity:var(--vde-gallery-paper-overlay-opacity,_0.55)]"
          />
        ) : null}
        {isImmersive ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] [background:radial-gradient(circle_at_10%_0%,_rgba(126,_87,_255,_0.22),_transparent_50%),_radial-gradient(circle_at_100%_100%,_rgba(87,_195,_255,_0.2),_transparent_48%)]"
          />
        ) : null}
        <div className="relative z-10">{children}</div>
      </section>
    );
  }
);

GalleryStage.displayName = 'GalleryStage';
