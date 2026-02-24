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

  if (visionId === 'museum' || visionId === 'the_archive') {
    return 'paper';
  }

  if (visionId === 'brutalist' || visionId === 'raw_data' || visionId === 'swiss_international') {
    return 'slab';
  }

  return 'glass';
}

export const GalleryStage = React.forwardRef<HTMLDivElement, GalleryStageProps>(
  ({ className = '', children, material = 'adaptive', ...props }, ref) => {
    const { activeVision } = useVision();
    const resolvedMaterial = resolveMaterial(activeVision.id, material);
    const isMuseum = activeVision.id === 'museum' || activeVision.id === 'the_archive';
    const isBrutalist = activeVision.id === 'brutalist' || activeVision.id === 'raw_data';
    const isImmersive = activeVision.id === 'immersive' || activeVision.id === 'the_ether';
    const isDeconstruct = activeVision.id === 'deconstruct';
    const isZineCollage = activeVision.id === 'zine_collage';

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
      isDeconstruct ? '[transform:rotate(var(--vde-component-tilt,_-1deg))]' : '',
      isDeconstruct ? 'z-[3]' : '',
      isZineCollage ? '[clip-path:var(--vde-gallery-torn-clip-path)]' : '',
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
        {isZineCollage ? (
          <div className="pointer-events-none absolute inset-0 z-[2] [opacity:var(--vde-gallery-tape-opacity,0.95)]">
            <svg className="absolute left-2 top-2 h-12 w-12 -rotate-6" viewBox="0 0 100 100" aria-hidden="true">
              <polygon points="10,20 88,12 94,82 18,90" fill="rgba(239,231,202,0.72)" stroke="rgba(64,49,37,0.2)" />
            </svg>
            <svg className="absolute right-2 top-2 h-12 w-12 rotate-6" viewBox="0 0 100 100" aria-hidden="true">
              <polygon points="12,14 90,24 82,90 6,78" fill="rgba(239,231,202,0.7)" stroke="rgba(64,49,37,0.2)" />
            </svg>
            <svg className="absolute bottom-2 left-2 h-12 w-12 rotate-3" viewBox="0 0 100 100" aria-hidden="true">
              <polygon points="16,10 92,18 84,88 8,84" fill="rgba(239,231,202,0.68)" stroke="rgba(64,49,37,0.2)" />
            </svg>
            <svg className="absolute bottom-2 right-2 h-12 w-12 -rotate-3" viewBox="0 0 100 100" aria-hidden="true">
              <polygon points="8,18 86,8 92,82 14,92" fill="rgba(239,231,202,0.74)" stroke="rgba(64,49,37,0.2)" />
            </svg>
          </div>
        ) : null}
        <div className="relative z-10">{children}</div>
      </section>
    );
  }
);

GalleryStage.displayName = 'GalleryStage';
