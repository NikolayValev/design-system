import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  applyVisionToElement,
  getVisionThemeById,
} from '@nikolayvalev/design-system';

const editorialTheme = getVisionThemeById('editorial')!;

function ModePanel({ mode }: { mode: 'light' | 'dark' }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      applyVisionToElement(ref.current, editorialTheme, mode);
    }
  }, [mode]);

  return (
    <div
      ref={ref}
      className="flex-1 min-w-[280px] rounded-2xl p-6 space-y-4"
      style={{ background: 'var(--vde-color-background)', color: 'var(--vde-color-foreground)', border: '1px solid var(--vde-color-border)' }}
    >
      <p className="text-xs uppercase tracking-[0.18em] opacity-60">
        Editorial — {mode.charAt(0).toUpperCase() + mode.slice(1)}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button variant="default">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sample card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor={`modes-input-${mode}`}>Search</Label>
            <Input id={`modes-input-${mode}`} placeholder="Type something…" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ThemeModesComparison(): JSX.Element {
  return (
    <div className="min-h-screen p-8" style={{ background: '#111' }}>
      <p className="mb-6 text-xs uppercase tracking-[0.22em] text-white/50">
        Editorial vision — light vs dark
      </p>
      <div className="flex flex-wrap gap-6">
        <ModePanel mode="light" />
        <ModePanel mode="dark" />
      </div>
    </div>
  );
}

const meta = {
  title: 'Themes/Modes',
  component: ThemeModesComparison,
  parameters: {
    vdeFrame: 'edge',
    docs: {
      description: {
        component:
          'Shows the Editorial vision rendered side by side in light and dark mode. Each panel applies CSS variables directly to its own container via applyVisionToElement.',
      },
    },
  },
} satisfies Meta<typeof ThemeModesComparison>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightAndDark: Story = {};
