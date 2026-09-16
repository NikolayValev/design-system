import type React from 'react';

export interface ChartDatum {
  label: string;
  value: number;
}

export type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

/**
 * Every chart carries `role="img"`, and an `img` with no accessible name is
 * announced as an unlabelled graphic. `title` is therefore required rather than
 * optional — a chart that cannot say what it shows is a defect, not a variation.
 */
export interface ChartAccessibilityProps {
  /** Accessible name for the graphic, e.g. "Weekly active users, Jan-Jun". */
  title: string;
  /** Optional longer description for charts whose trend needs spelling out. */
  description?: string;
}

export interface CartesianChartProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'>,
    ChartAccessibilityProps {
  data: ChartDatum[];
  width?: number;
  height?: number;
  colorIndex?: ChartColorIndex;
}

export interface DonutProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'>,
    ChartAccessibilityProps {
  data: ChartDatum[];
  size?: number;
  thickness?: number;
}
