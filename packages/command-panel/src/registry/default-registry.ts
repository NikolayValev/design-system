import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  StatChip,
  Layout,
  SectionShell,
  FeatureTile,
  LineChart,
  BarChart,
  AreaChart,
  Donut,
} from '@nikolayvalev/design-system';
import { createComponentRegistry, type ComponentEntry } from './component-registry';

const entries: ComponentEntry[] = [
  { name: 'Card', component: Card, description: 'A surface container that groups related content.' },
  { name: 'CardHeader', component: CardHeader, description: 'Header region of a Card.' },
  { name: 'CardTitle', component: CardTitle, description: 'Title text inside a CardHeader.' },
  { name: 'CardContent', component: CardContent, description: 'Body region of a Card.' },
  { name: 'Badge', component: Badge, description: 'Small inline status/label chip.' },
  { name: 'StatChip', component: StatChip, description: 'Compact metric token: a label and a value.' },
  { name: 'Layout', component: Layout, description: 'Generic layout container for arranging children.' },
  { name: 'SectionShell', component: SectionShell, description: 'A titled section wrapper for grouping widgets.' },
  { name: 'FeatureTile', component: FeatureTile, description: 'A tile highlighting a single feature or figure.' },
  { name: 'LineChart', component: LineChart, description: 'SVG line chart. Props: data ({label,value}[]), colorIndex (1-5).' },
  { name: 'BarChart', component: BarChart, description: 'SVG bar chart. Props: data ({label,value}[]), colorIndex (1-5).' },
  { name: 'AreaChart', component: AreaChart, description: 'SVG area chart. Props: data ({label,value}[]), colorIndex (1-5).' },
  { name: 'Donut', component: Donut, description: 'SVG donut chart. Props: data ({label,value}[]), size, thickness.' },
];

/** The canonical default vocabulary: design-system primitives + chart primitives. */
export const defaultComponentRegistry = createComponentRegistry(entries);
