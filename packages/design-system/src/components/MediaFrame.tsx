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
  ({ alt = '', children, className = '', kind = 'image', poster, src, style, ...props }, ref) => {
    const { activeVision } = useVision();
    const isMuseum = activeVision.id === 'museum';
    const isBrutalist = activeVision.id === 'brutalist';
    const isImmersive = activeVision.id === 'immersive';

    const frameStyle: React.CSSProperties = {
      boxShadow: isMuseum
        ? 'var(--vde-media-passpartout-shadow, inset 0 0 0 0.6rem rgba(255, 253, 246, 0.9), inset 0 0 2.3rem rgba(38, 28, 16, 0.2))'
        : 'var(--vde-shadow-ambient)',
      ...style,
    };

    const mediaFilter = isBrutalist
      ? 'var(--vde-media-contrast-filter, grayscale(1) contrast(2.2) saturate(0) brightness(1.05))'
      : 'none';

    const classes = [
      'relative',
      'isolate',
      'overflow-hidden',
      'border',
      'bg-[var(--vde-color-surface)]',
      '[border-color:var(--vde-color-border)]',
      '[border-width:var(--vde-border-width)]',
      '[border-radius:var(--vde-boundary-radius)]',
      className,
    ].join(' ');

    return (
      <figure ref={ref} className={classes} data-vde-component="media-frame" style={frameStyle} {...props}>
        <div
          className="[&>img]:block [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>video]:block [&>video]:h-full [&>video]:w-full [&>video]:object-cover"
          style={{ filter: mediaFilter }}
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
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: 'var(--vde-media-light-leak, inset 0 0 2.8rem rgba(146, 92, 255, 0.45), inset 0 0 1.4rem rgba(80, 200, 255, 0.32))' }}
          />
        ) : null}
      </figure>
    );
  }
);

MediaFrame.displayName = 'MediaFrame';
