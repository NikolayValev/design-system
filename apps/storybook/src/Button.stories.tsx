import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@nikolayvalev/design-system';
import { ArrowUpRight, Sparkles, Trash2, Loader2, Check } from 'lucide-react';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    storyCaption:
      'Token-driven primitive. Hover, focus, and shadow physics shift across visions — switch the toolbar to feel each archetype.',
    docs: { description: { component: 'Token-driven action primitive with five variants (default, secondary, destructive, outline, ghost) and three sizes. All visual properties derive from the active VDE theme.' } },
  },
  args: {
    children: 'Action',
    variant: 'default',
    size: 'md',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const sectionLabel =
  'text-[10px] uppercase tracking-[0.28em] opacity-60 [font-family:var(--vde-font-mono)]';
const sectionTitle =
  'text-xl md:text-2xl [font-family:var(--vde-font-display)] [letter-spacing:var(--vde-letter-spacing-tight)]';
const card =
  'relative rounded-[var(--vde-boundary-radius)] border [border-color:var(--vde-color-border)] bg-[var(--vde-color-surface)] [color:var(--vde-color-surface-foreground)] p-6 md:p-8';

export const Playground: Story = {};

export const Gallery: Story = {
  render: args => (
    <div className="space-y-10">
      <section className={card}>
        <div className="flex items-end justify-between gap-4 border-b pb-4 [border-color:var(--vde-color-border)]">
          <div>
            <p className={sectionLabel}>01 — Variants</p>
            <h3 className={`${sectionTitle} mt-1`}>Five tones, one contract</h3>
          </div>
          <p className="hidden max-w-[28ch] text-xs leading-relaxed opacity-70 md:block">
            Each variant maps to a different semantic token pair — never a hardcoded color.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {(['default', 'secondary', 'destructive', 'outline', 'ghost'] as const).map(variant => (
            <div key={variant} className="space-y-3">
              <Button {...args} variant={variant} className="w-full">
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
              <p className="text-[10px] uppercase tracking-[0.22em] opacity-55">{variant}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={card}>
        <div className="flex items-end justify-between gap-4 border-b pb-4 [border-color:var(--vde-color-border)]">
          <div>
            <p className={sectionLabel}>02 — Scale</p>
            <h3 className={`${sectionTitle} mt-1`}>Three weights of presence</h3>
          </div>
          <p className="hidden max-w-[28ch] text-xs leading-relaxed opacity-70 md:block">
            Sizes track the typography scale so density stays harmonious across surfaces.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <Button {...args} size="sm">
            Small
          </Button>
          <Button {...args} size="md">
            Medium
          </Button>
          <Button {...args} size="lg">
            Large
          </Button>
        </div>
      </section>

      <section className={card}>
        <div className="flex items-end justify-between gap-4 border-b pb-4 [border-color:var(--vde-color-border)]">
          <div>
            <p className={sectionLabel}>03 — Icon pairings</p>
            <h3 className={`${sectionTitle} mt-1`}>Glyphs as affordance</h3>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button {...args}>
            <Sparkles className="mr-2 h-4 w-4" /> Generate variant
          </Button>
          <Button {...args} variant="secondary">
            View report <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
          <Button {...args} variant="outline">
            <Check className="mr-2 h-4 w-4" /> Mark as done
          </Button>
          <Button {...args} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete artifact
          </Button>
        </div>
      </section>

      <section className={card}>
        <div className="flex items-end justify-between gap-4 border-b pb-4 [border-color:var(--vde-color-border)]">
          <div>
            <p className={sectionLabel}>04 — States</p>
            <h3 className={`${sectionTitle} mt-1`}>Quiet states, deliberate motion</h3>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Button {...args} className="w-full">
              Idle
            </Button>
            <p className="text-[10px] uppercase tracking-[0.22em] opacity-55">rest</p>
          </div>
          <div className="space-y-2">
            <Button {...args} disabled className="w-full">
              Disabled
            </Button>
            <p className="text-[10px] uppercase tracking-[0.22em] opacity-55">disabled</p>
          </div>
          <div className="space-y-2">
            <Button {...args} className="w-full" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
            </Button>
            <p className="text-[10px] uppercase tracking-[0.22em] opacity-55">pending</p>
          </div>
        </div>
      </section>
    </div>
  ),
};

export const VariantSet: Story = {
  render: args => (
    <div className="flex flex-wrap gap-3">
      <Button {...args} variant="default">
        Default
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="destructive">
        Destructive
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
    </div>
  ),
};
