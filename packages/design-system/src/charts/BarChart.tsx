import React from 'react';
import { computeBars } from './geometry';
import type { CartesianChartProps } from './types';

const PAD = 8;

/** BarChart - single-series SVG bars, colored by a --chart-N token. */
export const BarChart = React.forwardRef<SVGSVGElement, CartesianChartProps>(
  ({ data, width = 320, height = 180, colorIndex = 1, className = '', ...props }, ref) => {
    const innerW = width - PAD * 2;
    const innerH = height - PAD * 2;
    const bars = computeBars(
      data.map((d) => d.value),
      { width: innerW, height: innerH },
    );
    return (
      <svg ref={ref} viewBox={`0 0 ${width} ${height}`} role="img" className={className} {...props}>
        <g transform={`translate(${PAD},${PAD})`}>
          {bars.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.width}
              height={b.height}
              rx={2}
              fill={`var(--chart-${colorIndex})`}
            />
          ))}
        </g>
      </svg>
    );
  },
);

BarChart.displayName = 'BarChart';
