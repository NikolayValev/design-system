import { visionThemes, type VisionTheme } from '@nikolayvalev/design-system';
import type { DataSource } from '@nikolayvalev/command-panel';
import metrics from './metrics.generated.json';

const series = (entries: [string, number][]) => entries.map(([label, value]) => ({ label, value }));

export const dataSources: DataSource[] = [
  {
    id: 'catalog.counts',
    description: 'Design-system catalog: number of components, sections, and pages.',
    resultSchema: { type: 'array', items: { label: 'string', value: 'number' } },
    load: async () =>
      series([
        ['Components', metrics.components],
        ['Sections', metrics.sections],
        ['Pages', metrics.pages],
      ]),
  },
  {
    id: 'components.count',
    description: 'Number of design-system components.',
    resultSchema: { count: 'number' },
    load: async () => ({ count: metrics.components }),
  },
  {
    id: 'sections.count',
    description: 'Number of design-system sections.',
    resultSchema: { count: 'number' },
    load: async () => ({ count: metrics.sections }),
  },
  {
    id: 'pages.count',
    description: 'Number of design-system pages.',
    resultSchema: { count: 'number' },
    load: async () => ({ count: metrics.pages }),
  },
  {
    id: 'stories.count',
    description: 'Number of Storybook stories across the monorepo.',
    resultSchema: { count: 'number' },
    load: async () => ({ count: metrics.stories }),
  },
  {
    id: 'visions.list',
    description: 'All vision themes: id, display name, and family.',
    resultSchema: { type: 'array', items: { id: 'string', name: 'string', family: 'string' } },
    load: async () =>
      visionThemes.map((v: VisionTheme) => ({ id: v.id, name: v.name, family: v.family })),
  },
  {
    id: 'visions.byFamily',
    description: 'Count of vision themes grouped by family (chart-ready).',
    resultSchema: { type: 'array', items: { label: 'string', value: 'number' } },
    load: async () => {
      const counts = new Map<string, number>();
      for (const v of visionThemes) counts.set(v.family, (counts.get(v.family) ?? 0) + 1);
      return [...counts.entries()].map(([label, value]) => ({ label, value }));
    },
  },
  {
    id: 'bundle.sizes',
    description: 'Design-system build output sizes in bytes (chart-ready, largest first).',
    resultSchema: { type: 'array', items: { label: 'string', value: 'number' } },
    load: async () => metrics.bundle.map((b) => ({ label: b.file, value: b.bytes })),
  },
];
