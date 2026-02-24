import React from 'react';
import { useVision } from '../vde-core';

export interface AtmosphereProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  fixedBackground?: boolean;
  intensity?: 'soft' | 'normal' | 'strong';
  mode?: 'auto' | 'archive' | 'nexus' | 'none';
}

const archiveOpacityClass: Record<NonNullable<AtmosphereProviderProps['intensity']>, string> = {
  soft: '[opacity:calc(var(--vde-atmosphere-archive-opacity,_0.16)_*_0.6)]',
  normal: '[opacity:calc(var(--vde-atmosphere-archive-opacity,_0.16)_*_1)]',
  strong: '[opacity:calc(var(--vde-atmosphere-archive-opacity,_0.16)_*_1.45)]',
};

const noiseOpacityClass: Record<NonNullable<AtmosphereProviderProps['intensity']>, string> = {
  soft: '[opacity:calc(var(--vde-atmosphere-noise-opacity,_0.08)_*_0.6)]',
  normal: '[opacity:calc(var(--vde-atmosphere-noise-opacity,_0.08)_*_1)]',
  strong: '[opacity:calc(var(--vde-atmosphere-noise-opacity,_0.08)_*_1.45)]',
};

const nexusOpacityClass: Record<NonNullable<AtmosphereProviderProps['intensity']>, string> = {
  soft: '[opacity:calc(var(--vde-atmosphere-nexus-opacity,_0.85)_*_0.6)]',
  normal: '[opacity:calc(var(--vde-atmosphere-nexus-opacity,_0.85)_*_1)]',
  strong: '[opacity:calc(var(--vde-atmosphere-nexus-opacity,_0.85)_*_1.45)]',
};

const NOISE_FILTER_ID = 'vde-atmosphere-noise-filter';

function resolveMode(visionId: string, mode: NonNullable<AtmosphereProviderProps['mode']>): 'archive' | 'nexus' | 'none' {
  if (mode !== 'auto') {
    return mode;
  }

  const nexusVisions = new Set([
    'immersive',
    'aurora',
    'the_ether',
    'solarpunk',
    'y2k_chrome',
    'clay_soft',
  ]);

  return nexusVisions.has(visionId) ? 'nexus' : 'archive';
}

export const AtmosphereProvider = React.forwardRef<HTMLDivElement, AtmosphereProviderProps>(
  ({ children, className = '', fixedBackground = false, intensity = 'normal', mode = 'auto', ...props }, ref) => {
    const { activeVision } = useVision();
    const atmosphereMode = resolveMode(activeVision.id, mode);
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
      <section ref={ref} className={classes} data-vde-component="atmosphere-provider" {...props}>
        <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
          <filter id={NOISE_FILTER_ID}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="17" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>

        {atmosphereMode === 'archive' ? (
          <>
            <span
              aria-hidden="true"
              className={`${layerPositionClass} pointer-events-none [background-image:var(--vde-surface-texture)] ${archiveOpacityClass[intensity]}`}
            />
            <span
              aria-hidden="true"
              className={`${layerPositionClass} pointer-events-none bg-black mix-blend-multiply [filter:url(#${NOISE_FILTER_ID})] ${noiseOpacityClass[intensity]}`}
            />
          </>
        ) : null}

        {atmosphereMode === 'nexus' ? (
          <span
            aria-hidden="true"
            className={`${layerPositionClass} pointer-events-none [background:var(--vde-atmosphere-mesh-gradient,_radial-gradient(circle_at_12%_8%,_rgba(130,_88,_255,_0.46),_transparent_42%),_radial-gradient(circle_at_86%_18%,_rgba(74,_197,_255,_0.42),_transparent_47%),_radial-gradient(circle_at_60%_100%,_rgba(58,_255,_169,_0.2),_transparent_55%))] [animation:var(--vde-atmosphere-motion,_none)] ${nexusOpacityClass[intensity]}`}
          />
        ) : null}

        <div className="relative z-10">{children}</div>
      </section>
    );
  }
);

AtmosphereProvider.displayName = 'AtmosphereProvider';
