import type React from 'react';

export interface ChartDatum {
  label: string;
  value: number;
}

export type ChartColorIndex = 1 | 2 | 3 | 4 | 5;

export interface CartesianChartProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> {
  data: ChartDatum[];
  width?: number;
  height?: number;
  colorIndex?: ChartColorIndex;
}

export interface DonutProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> {
  data: ChartDatum[];
  size?: number;
  thickness?: number;
}
