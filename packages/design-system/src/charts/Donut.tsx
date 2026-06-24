import React from 'react';
import { buildDonutArcs } from './geometry';
import type { DonutProps } from './types';

/** Donut - multi-slice ring chart; slice colors cycle --chart-1..5. */
export const Donut = React.forwardRef<SVGSVGElement, DonutProps>(
  ({ data, size = 180, thickness = 28, className = '', ...props }, ref) => {
    const cx = size / 2;
    const cy = size / 2;
    const rOuter = size / 2;
    const rInner = Math.max(0, rOuter - thickness);
    const arcs = buildDonutArcs(
      data.map((d) => d.value),
      { cx, cy, rOuter, rInner },
    );
    return (
      <svg ref={ref} viewBox={`0 0 ${size} ${size}`} role="img" className={className} {...props}>
        {arcs.map((a, i) => (
          <path key={i} d={a.d} fill={`var(--chart-${a.colorIndex})`} />
        ))}
      </svg>
    );
  },
);

Donut.displayName = 'Donut';
