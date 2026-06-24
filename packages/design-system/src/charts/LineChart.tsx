import React from 'react';
import { scaleLinear, extent, buildLinePath, type Point } from './geometry';
import type { CartesianChartProps } from './types';

const PAD = 8;

/** LineChart - single-series SVG line, colored by a --chart-N token. */
export const LineChart = React.forwardRef<SVGSVGElement, CartesianChartProps>(
  ({ data, width = 320, height = 180, colorIndex = 1, className = '', ...props }, ref) => {
    const innerW = width - PAD * 2;
    const innerH = height - PAD * 2;
    const [, yMax] = extent(data.map((d) => d.value));
    const xMax = Math.max(1, data.length - 1);
    const sx = scaleLinear([0, xMax], [PAD, PAD + innerW]);
    const sy = scaleLinear([0, yMax === 0 ? 1 : yMax], [PAD + innerH, PAD]);
    const points: Point[] = data.map((d, i) => ({ x: sx(i), y: sy(d.value) }));
    const d = buildLinePath(points);
    return (
      <svg ref={ref} viewBox={`0 0 ${width} ${height}`} role="img" className={className} {...props}>
        <path
          d={d}
          fill="none"
          stroke={`var(--chart-${colorIndex})`}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  },
);

LineChart.displayName = 'LineChart';
