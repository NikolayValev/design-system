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
  ({ className = '', children, material = 'adaptive', style, ...props }, ref) => {
    const { activeVision } = useVision();
    const resolvedMaterial = resolveMaterial(activeVision.id, material);
    const isMuseum = activeVision.id === 'museum' || activeVision.id === 'the_archive';
    const isBrutalist = activeVision.id === 'brutalist' || activeVision.id === 'raw_data';
    const isImmersive = activeVision.id === 'immersive' || activeVision.id === 'the_ether';
    const isDeconstruct = activeVision.id === 'deconstruct';
    const isZineCollage = activeVision.id === 'zine_collage';

    const stageStyle: React.CSSProperties = {
      background:
        resolvedMaterial === 'glass'
          ? 'var(--vde-gallery-glass-background, color-mix(in oklab, var(--vde-color-surface) 78%, transparent))'
          : 'var(--vde-gallery-material-background, var(--vde-color-surface))',
      boxShadow: isBrutalist ? 'var(--vde-gallery-offset-shadow, 4px 4px 0 0 #000)' : 'var(--vde-shadow-ambient)',
      backdropFilter: isImmersive ? 'blur(var(--vde-gallery-backdrop-blur, 20px))' : 'none',
      WebkitBackdropFilter: isImmersive ? 'blur(var(--vde-gallery-backdrop-blur, 20px))' : 'none',
      transform: isDeconstruct ? 'rotate(var(--vde-component-tilt, -1deg))' : undefined,
      zIndex: isDeconstruct ? 3 : undefined,
      clipPath: isZineCollage ? 'var(--vde-gallery-torn-clip-path)' : undefined,
      ...style,
    };

    const classes = [
      'relative',
      'isolate',
      'overflow-hidden',
      'border',
      '[border-color:var(--vde-color-border)]',
      '[border-width:var(--vde-border-width)]',
      '[border-radius:var(--vde-boundary-radius)]',
      '[color:var(--vde-color-surface-foreground)]',
      'transition-all',
      '[transition-duration:var(--vde-motion-duration-normal)]',
      '[transition-timing-function:var(--vde-motion-easing-standard)]',
      className,
    ].join(' ');

    return (
      <section ref={ref} className={classes} data-vde-component="gallery-stage" style={stageStyle} {...props}>
        <AestheticOrnaments />
        {isMuseum ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              backgroundImage: 'var(--vde-surface-texture)',
              opacity: 'var(--vde-gallery-paper-overlay-opacity, 0.55)',
            }}
          />
        ) : null}
        {isImmersive ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background:
                'radial-gradient(circle at 10% 0%, rgba(126, 87, 255, 0.22), transparent 50%), radial-gradient(circle at 100% 100%, rgba(87, 195, 255, 0.2), transparent 48%)',
            }}
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
