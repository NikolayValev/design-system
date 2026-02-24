import React from 'react';
import { useVision } from '../vde-core';

export interface MediaFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  alt?: string;
  children?: React.ReactNode;
  kind?: 'image' | 'video';
  poster?: string;
  src?: string;
}

export const MediaFrame = React.forwardRef<HTMLDivElement, MediaFrameProps>(
  ({ alt = '', children, className = '', kind = 'image', poster, src, ...props }, ref) => {
    const { activeVision } = useVision();
    const isMuseum = activeVision.id === 'museum' || activeVision.id === 'the_archive';
    const isBrutalist = activeVision.id === 'brutalist' || activeVision.id === 'raw_data';
    const isImmersive = activeVision.id === 'immersive' || activeVision.id === 'the_ether';
    const isY2KChrome = activeVision.id === 'y2k_chrome';
    const isDeconstruct = activeVision.id === 'deconstruct';

    const classes = [
      'relative',
      'isolate',
      'overflow-hidden',
      'border',
      'bg-[var(--vde-color-surface)]',
      '[border-color:var(--vde-color-border)]',
      '[border-width:var(--vde-border-width)]',
      '[border-radius:var(--vde-boundary-radius)]',
      isMuseum
        ? '[box-shadow:var(--vde-media-passpartout-shadow,_inset_0_0_0_0.6rem_rgba(255,_253,_246,_0.9),_inset_0_0_2.3rem_rgba(38,_28,_16,_0.2))]'
        : '[box-shadow:var(--vde-shadow-ambient)]',
      isDeconstruct ? '[transform:rotate(var(--vde-component-tilt,_-1deg))]' : '',
      isDeconstruct ? 'z-[4]' : '',
      className,
    ].join(' ');

    return (
      <figure ref={ref} className={classes} data-vde-component="media-frame" {...props}>
        <div
          className={[
            '[&>img]:block [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>video]:block [&>video]:h-full [&>video]:w-full [&>video]:object-cover',
            isBrutalist ? '[filter:var(--vde-media-contrast-filter,_grayscale(1)_contrast(2.2)_saturate(0)_brightness(1.05))]' : '[filter:none]',
          ].join(' ')}
        >
          {children
            ? children
            : kind === 'video'
              ? <video controls poster={poster} src={src} />
              : <img src={src} alt={alt} loading="lazy" />}
        </div>
        {isImmersive ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [box-shadow:var(--vde-media-light-leak,_inset_0_0_2.8rem_rgba(146,_92,_255,_0.45),_inset_0_0_1.4rem_rgba(80,_200,_255,_0.32))]"
          />
        ) : null}
        {isY2KChrome ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:var(--vde-media-scanline-pattern)] [opacity:var(--vde-media-scanline-opacity,_0.24)] [mix-blend-mode:multiply]"
          />
        ) : null}
      </figure>
    );
  }
);

MediaFrame.displayName = 'MediaFrame';
