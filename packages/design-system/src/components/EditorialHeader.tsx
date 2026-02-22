import React from 'react';
import { useVision } from '../vde-core';

export interface EditorialHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'massive';
  writingMode?: 'horizontal' | 'vertical';
}

const sizeMap: Record<NonNullable<EditorialHeaderProps['size']>, string> = {
  sm: 'clamp(1.4rem, 2vw, 1.8rem)',
  md: 'clamp(1.9rem, 3.5vw, 2.8rem)',
  lg: 'clamp(2.6rem, 5.2vw, 4rem)',
  massive: 'var(--vde-editorial-massive-size, clamp(4rem, 11vw, 10rem))',
};

export const EditorialHeader = React.forwardRef<HTMLHeadingElement, EditorialHeaderProps>(
  ({ as = 'h1', size = 'lg', writingMode = 'horizontal', className = '', style, ...props }, ref) => {
    const { activeVision } = useVision();
    const isMuseum = activeVision.id === 'museum';
    const isBrutalist = activeVision.id === 'brutalist';
    const isImmersive = activeVision.id === 'immersive';
    const Tag = as;

    const visionStyle: React.CSSProperties = {
      fontSize: sizeMap[size],
      writingMode: writingMode === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
      textOrientation: writingMode === 'vertical' ? 'mixed' : 'initial',
      ...(isMuseum
        ? {
            marginBlock: 'var(--vde-editorial-margin-block, clamp(2.5rem, 8vw, 7rem))',
            marginInline: 'var(--vde-editorial-margin-inline, clamp(1rem, 10vw, 9rem))',
            fontFamily: 'var(--vde-font-display)',
          }
        : null),
      ...(isBrutalist
        ? {
            color: 'var(--vde-color-background)',
            background: 'var(--vde-color-foreground)',
            paddingInline: '0.32em',
            paddingBlock: '0.08em',
            textTransform: 'uppercase',
          }
        : null),
      ...(isImmersive
        ? {
            color: 'var(--vde-color-foreground)',
            letterSpacing: 'var(--vde-letter-spacing-wide)',
            textShadow: 'var(--vde-editorial-glow, 0 0 24px rgba(157, 95, 255, 0.4))',
          }
        : null),
      ...style,
    };

    const classes = [
      'relative',
      'inline-block',
      'max-w-full',
      '[font-family:var(--vde-font-display)]',
      '[line-height:var(--vde-line-height-tight)]',
      'transition-all',
      '[transition-duration:var(--vde-motion-duration-normal)]',
      '[transition-timing-function:var(--vde-motion-easing-standard)]',
      isBrutalist ? 'font-black [letter-spacing:0.04em]' : 'font-semibold [letter-spacing:var(--vde-letter-spacing-tight)]',
      className,
    ].join(' ');

    return <Tag ref={ref} className={classes} data-vde-component="editorial-header" style={visionStyle} {...props} />;
  }
);

EditorialHeader.displayName = 'EditorialHeader';
