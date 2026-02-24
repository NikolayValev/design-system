import React from 'react';
import { useVision } from '../vde-core';

export interface EditorialHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'massive';
  writingMode?: 'horizontal' | 'vertical';
}

const sizeClassMap: Record<NonNullable<EditorialHeaderProps['size']>, string> = {
  sm: '[font-size:clamp(1.4rem,_2vw,_1.8rem)]',
  md: '[font-size:clamp(1.9rem,_3.5vw,_2.8rem)]',
  lg: '[font-size:clamp(2.6rem,_5.2vw,_4rem)]',
  massive: '[font-size:var(--vde-editorial-massive-size,_clamp(4rem,_11vw,_10rem))]',
};

export const EditorialHeader = React.forwardRef<HTMLHeadingElement, EditorialHeaderProps>(
  ({ as = 'h1', size = 'lg', writingMode = 'horizontal', className = '', ...props }, ref) => {
    const { activeVision } = useVision();
    const isMuseum = activeVision.id === 'museum' || activeVision.id === 'the_archive';
    const isBrutalist = activeVision.id === 'brutalist' || activeVision.id === 'raw_data';
    const isImmersive =
      activeVision.id === 'immersive' || activeVision.id === 'the_ether' || activeVision.id === 'y2k_chrome';
    const isMaMinimalism = activeVision.id === 'ma_minimalism';
    const isDeconstruct = activeVision.id === 'deconstruct';
    const Tag = as;
    const resolvedWritingMode = isMaMinimalism && writingMode === 'horizontal' ? 'vertical' : writingMode;

    const classes = [
      'relative',
      'inline-block',
      'max-w-full',
      sizeClassMap[size],
      resolvedWritingMode === 'vertical'
        ? '[writing-mode:vertical-rl] [text-orientation:mixed]'
        : '[writing-mode:horizontal-tb] [text-orientation:initial]',
      isMuseum
        ? '[margin-block:var(--vde-editorial-margin-block,_clamp(2.5rem,_8vw,_7rem))] [margin-inline:var(--vde-editorial-margin-inline,_clamp(1rem,_10vw,_9rem))]'
        : '',
      isBrutalist
        ? '[color:var(--vde-color-background)] [background:var(--vde-color-foreground)] [padding-inline:0.32em] [padding-block:0.08em] uppercase'
        : '',
      isImmersive
        ? '[color:var(--vde-color-foreground)] [letter-spacing:var(--vde-letter-spacing-wide)] [text-shadow:var(--vde-editorial-glow,_0_0_24px_rgba(157,_95,_255,_0.4))]'
        : '',
      isMaMinimalism ? 'font-light [letter-spacing:var(--vde-letter-spacing-wide)]' : '',
      isDeconstruct ? '[transform:rotate(var(--vde-component-tilt,_-1deg))]' : '',
      '[font-family:var(--vde-font-display)]',
      '[line-height:var(--vde-line-height-tight)]',
      'transition-all',
      '[transition-duration:var(--vde-motion-duration-normal)]',
      '[transition-timing-function:var(--vde-motion-easing-standard)]',
      isBrutalist ? 'font-black [letter-spacing:0.04em]' : 'font-semibold [letter-spacing:var(--vde-letter-spacing-tight)]',
      className,
    ].join(' ');

    return <Tag ref={ref} className={classes} data-vde-component="editorial-header" {...props} />;
  }
);

EditorialHeader.displayName = 'EditorialHeader';
