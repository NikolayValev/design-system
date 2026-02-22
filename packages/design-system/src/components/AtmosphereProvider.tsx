import React from 'react';
import { useVision } from '../vde-core';

export interface AtmosphereProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  fixedBackground?: boolean;
  intensity?: 'soft' | 'normal' | 'strong';
  mode?: 'auto' | 'archive' | 'nexus' | 'none';
}

const intensityScale: Record<NonNullable<AtmosphereProviderProps['intensity']>, number> = {
  soft: 0.6,
  normal: 1,
  strong: 1.45,
};

function resolveMode(visionId: string, mode: NonNullable<AtmosphereProviderProps['mode']>): 'archive' | 'nexus' | 'none' {
  if (mode !== 'auto') {
    return mode;
  }

  return visionId === 'immersive' ? 'nexus' : 'archive';
}

export const AtmosphereProvider = React.forwardRef<HTMLDivElement, AtmosphereProviderProps>(
  ({ children, className = '', fixedBackground = false, intensity = 'normal', mode = 'auto', style, ...props }, ref) => {
    const { activeVision } = useVision();
    const atmosphereMode = resolveMode(activeVision.id, mode);
    const filterId = React.useId().replace(/:/g, '');
    const layerOpacity = intensityScale[intensity];
    const layerPositionClass = fixedBackground ? 'fixed inset-0' : 'absolute inset-0';

    const classes = [
      'relative',
      'isolate',
      'overflow-hidden',
      'bg-[var(--vde-color-background)]',
      'text-[var(--vde-color-foreground)]',
      className,
    ].join(' ');

    return (
      <section ref={ref} className={classes} data-vde-component="atmosphere-provider" style={style} {...props}>
        <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="17" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>

        {atmosphereMode === 'archive' ? (
          <>
            <span
              aria-hidden="true"
              className={`${layerPositionClass} pointer-events-none`}
              style={{
                backgroundImage: 'var(--vde-surface-texture)',
                opacity: `calc(var(--vde-atmosphere-archive-opacity, 0.16) * ${layerOpacity})`,
              }}
            />
            <span
              aria-hidden="true"
              className={`${layerPositionClass} pointer-events-none bg-black mix-blend-multiply`}
              style={{
                filter: `url(#${filterId})`,
                opacity: `calc(var(--vde-atmosphere-noise-opacity, 0.08) * ${layerOpacity})`,
              }}
            />
          </>
        ) : null}

        {atmosphereMode === 'nexus' ? (
          <span
            aria-hidden="true"
            className={`${layerPositionClass} pointer-events-none`}
            style={{
              background: 'var(--vde-atmosphere-mesh-gradient, radial-gradient(circle at 12% 8%, rgba(130, 88, 255, 0.46), transparent 42%), radial-gradient(circle at 86% 18%, rgba(74, 197, 255, 0.42), transparent 47%), radial-gradient(circle at 60% 100%, rgba(58, 255, 169, 0.2), transparent 55%))',
              opacity: `calc(var(--vde-atmosphere-nexus-opacity, 0.85) * ${layerOpacity})`,
            }}
          />
        ) : null}

        <div className="relative z-10">{children}</div>
      </section>
    );
  }
);

AtmosphereProvider.displayName = 'AtmosphereProvider';
