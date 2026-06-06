import type { Meta, StoryObj } from '@storybook/react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@nikolayvalev/design-system';
import { ArrowUpRight, TrendingUp, Image as ImageIcon, MapPin } from 'lucide-react';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    storyCaption:
      'Surface primitive — token-driven background, border, and shadow inherit from the active vision. Compose with CardHeader, CardTitle, CardContent.',
    docs: { description: { component: 'Surface container with semantic sub-components (CardHeader, CardTitle, CardContent). Background, border, and shadow inherit from the active vision.' } },
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const muted = 'text-[var(--vde-color-muted-foreground)]';
const captionStyle = 'text-[10px] uppercase tracking-[0.24em] opacity-55';

export const Default: Story = {
  render: args => (
    <Card {...args} className="w-[380px]">
      <CardHeader>
        <p className={captionStyle}>Project · Snapshot</p>
        <CardTitle>Project Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm leading-relaxed ${muted}`}>
          Surface tokens, border weight, radius, and shadow physics all derive from the active vision. Switch the toolbar
          to see the same composition take on a different identity.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Patterns: Story = {
  render: args => (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <Card {...args}>
        <CardHeader>
          <p className={captionStyle}>Metric · Q4</p>
          <CardTitle className="!text-4xl">
            48.2<span className={`text-base ${muted}`}>k MAU</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>+12.4% vs prior quarter</span>
          </div>
          <p className={`mt-3 text-xs leading-relaxed ${muted}`}>
            Forecast from intent-segment cohorts. Source: analytics warehouse, refreshed nightly.
          </p>
        </CardContent>
      </Card>

      <Card {...args} className="flex flex-col">
        <div
          aria-hidden
          className="relative h-40 w-full overflow-hidden border-b [border-color:var(--vde-color-border)]"
          style={{
            background:
              'radial-gradient(120% 100% at 0% 0%, var(--vde-color-accent) 0%, var(--vde-color-secondary) 55%, var(--vde-color-surface) 100%)',
          }}
        >
          <div className="absolute inset-0 flex items-end p-4">
            <span className="rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.18em] [border-color:rgba(255,255,255,0.4)] [background:rgba(0,0,0,0.18)] text-white">
              <ImageIcon className="mr-1 inline h-3 w-3" /> Media
            </span>
          </div>
        </div>
        <CardHeader>
          <p className={captionStyle}>Story · Cover</p>
          <CardTitle>The light between mediums</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-sm leading-relaxed ${muted}`}>
            A long-read about how gradient meshes replaced ornament in the post-skeuomorphic era.
          </p>
        </CardContent>
      </Card>

      <Card {...args}>
        <CardHeader>
          <p className={captionStyle}>Action · Workflow</p>
          <CardTitle>Compose a new release</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`mb-5 text-sm leading-relaxed ${muted}`}>
            Bundle the latest tokens, changeset notes, and visual diff into a single artifact for downstream apps.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="default">
              Begin <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="ghost">Read brief</Button>
          </div>
        </CardContent>
      </Card>

      <Card {...args} className="md:col-span-2">
        <CardHeader>
          <p className={captionStyle}>Roster · Active</p>
          <CardTitle>Vision contributors</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y [divide-color:var(--vde-color-border)]">
            {[
              { name: 'Aria Lindqvist', role: 'Curator · Editorial', city: 'Stockholm' },
              { name: 'Theo Marchetti', role: 'Engineer · Tokens', city: 'Milan' },
              { name: 'Naomi Park', role: 'Designer · Motion', city: 'Seoul' },
            ].map(person => (
              <li
                key={person.name}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium">{person.name}</p>
                  <p className={`text-xs ${muted}`}>{person.role}</p>
                </div>
                <p className={`text-xs ${muted} flex items-center gap-1`}>
                  <MapPin className="h-3 w-3" /> {person.city}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card {...args}>
        <CardHeader>
          <p className={captionStyle}>Note · Editorial</p>
          <CardTitle className="!text-xl">A quiet contract</CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote
            className={`border-l-2 pl-4 text-sm italic leading-relaxed ${muted}`}
            style={{ borderColor: 'var(--vde-color-accent)' }}
          >
            “The system is not the surface — it’s the agreement between surfaces about how to behave.”
          </blockquote>
          <p className={`mt-3 text-xs ${muted}`}>— Field notes, vol. 02</p>
        </CardContent>
      </Card>
    </div>
  ),
};
