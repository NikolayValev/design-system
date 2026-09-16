import React from 'react';

export interface MediaFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  alt?: string;
  children?: React.ReactNode;
  kind?: 'image' | 'video';
  poster?: string;
  src?: string;
}

export const MediaFrame = React.forwardRef<HTMLDivElement, MediaFrameProps>(
  ({ alt = '', children, className = '', kind = 'image', poster, src, ...props }, ref) => {
    /*
     * Four per-theme branches used to live here, each with a hardcoded fallback —
     * a museum passe-partout, a brutalist grayscale filter, an immersive
     * purple/cyan light leak and a y2k scanline opacity. Every one of those
     * tokens already defaults to the neutral value, so the branches were
     * re-implementing the cascade and the fallbacks fired in themes that had
     * never asked for them.
     */
    const classes = [
      'relative',
      'isolate',
      'overflow-hidden',
      'border',
      'bg-[var(--vde-color-surface)]',
      '[border-color:var(--vde-color-border)]',
      '[border-width:var(--vde-border-width)]',
      '[border-radius:var(--vde-radius-surface)]',
      '[box-shadow:var(--vde-media-passpartout-shadow)]',
      className,
    ].join(' ');

    return (
      <figure ref={ref} className={classes} data-vde-component="media-frame" {...props}>
        <div
          className={[
            '[&>img]:block [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>video]:block [&>video]:h-full [&>video]:w-full [&>video]:object-cover',
            '[filter:var(--vde-media-contrast-filter)]',
          ].join(' ')}
        >
          {children
            ? children
            : kind === 'video'
              ? <video controls poster={poster} src={src} />
              : <img src={src} alt={alt} loading="lazy" />}
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [box-shadow:var(--vde-media-light-leak)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:var(--vde-media-scanline-pattern)] [opacity:var(--vde-media-scanline-opacity)] [mix-blend-mode:multiply]"
        />
      </figure>
    );
  }
);

MediaFrame.displayName = 'MediaFrame';
