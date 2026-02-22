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

  if (visionId === 'brutalist') {
    return 'slab';
  }

  return 'glass';
}

export const GalleryStage = React.forwardRef<HTMLDivElement, GalleryStageProps>(
  ({ className = '', children, material = 'adaptive', style, ...props }, ref) => {
    const { activeVision } = useVision();
    const resolvedMaterial = resolveMaterial(activeVision.id, material);
    const isMuseum = activeVision.id === 'museum';
    const isBrutalist = activeVision.id === 'brutalist';
    const isImmersive = activeVision.id === 'immersive';

    const stageStyle: React.CSSProperties = {
      background:
        resolvedMaterial === 'glass'
          ? 'var(--vde-gallery-glass-background, color-mix(in oklab, var(--vde-color-surface) 78%, transparent))'
          : 'var(--vde-gallery-material-background, var(--vde-color-surface))',
      boxShadow: isBrutalist ? 'var(--vde-gallery-offset-shadow, 4px 4px 0 0 #000)' : 'var(--vde-shadow-ambient)',
      backdropFilter: isImmersive ? 'blur(var(--vde-gallery-backdrop-blur, 20px))' : 'none',
      WebkitBackdropFilter: isImmersive ? 'blur(var(--vde-gallery-backdrop-blur, 20px))' : 'none',
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
        <div className="relative z-10">{children}</div>
      </section>
    );
  }
);

GalleryStage.displayName = 'GalleryStage';
