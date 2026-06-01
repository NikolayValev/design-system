import type { Meta, StoryObj } from '@storybook/react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@nikolayvalev/design-system';
import { Search, Mail, Lock, AtSign, AlertCircle } from 'lucide-react';

const meta = {
  title: 'Design System/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    storyCaption:
      'Form primitive — surface, border, focus ring, and motion all derive from the active vision.',
  },
  args: {
    placeholder: 'Type here...',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const muted = 'text-[var(--vde-color-muted-foreground)]';
const captionStyle = 'text-[10px] uppercase tracking-[0.24em] opacity-55';

function Field({
  label,
  hint,
  htmlFor,
  children,
  error,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
  error?: string;
}): JSX.Element {
  return (
    <label htmlFor={htmlFor} className="block space-y-1.5">
      <span className="flex items-baseline justify-between gap-3">
        <span className={`text-xs font-medium ${muted}`}>{label}</span>
        {hint ? <span className="text-[10px] uppercase tracking-[0.18em] opacity-50">{hint}</span> : null}
      </span>
      {children}
      {error ? (
        <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--vde-color-danger)' }}>
          <AlertCircle className="h-3 w-3" /> {error}
        </span>
      ) : null}
    </label>
  );
}

export const Default: Story = {
  render: args => (
    <div className="max-w-sm">
      <Field label="Workspace name" htmlFor="workspace" hint="required">
        <Input id="workspace" {...args} placeholder="e.g. Quiet Atlas" />
      </Field>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Read-only preview',
  },
  render: args => (
    <div className="max-w-sm">
      <Field label="Locked field" htmlFor="locked" hint="disabled">
        <Input id="locked" {...args} />
      </Field>
    </div>
  ),
};

export const FormContexts: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <p className={captionStyle}>Context · Search</p>
          <CardTitle>Find a fragment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Query" htmlFor="search-q" hint="⌘ K">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              <Input id="search-q" placeholder="Search collection annotation…" className="pl-9" />
            </div>
          </Field>
          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] opacity-60">
            <span className="rounded-full border px-2 py-1 [border-color:var(--vde-color-border)]">essays</span>
            <span className="rounded-full border px-2 py-1 [border-color:var(--vde-color-border)]">material</span>
            <span className="rounded-full border px-2 py-1 [border-color:var(--vde-color-border)]">index</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className={captionStyle}>Context · Sign in</p>
          <CardTitle>Return to studio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Email" htmlFor="login-email" hint="required">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              <Input id="login-email" type="email" placeholder="you@studio.co" className="pl-9" />
            </div>
          </Field>
          <Field label="Passphrase" htmlFor="login-pass">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              <Input id="login-pass" type="password" placeholder="••••••••" className="pl-9" />
            </div>
          </Field>
          <Button className="w-full">Enter studio</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className={captionStyle}>Context · Settings</p>
          <CardTitle>Author profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Display name" htmlFor="set-name">
            <Input id="set-name" defaultValue="Aria Lindqvist" />
          </Field>
          <Field label="Handle" htmlFor="set-handle" hint="public">
            <div className="relative">
              <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              <Input id="set-handle" defaultValue="aria" className="pl-9" />
            </div>
          </Field>
          <Field
            label="Studio email"
            htmlFor="set-email"
            error="This email is already linked to another workspace."
          >
            <Input id="set-email" defaultValue="aria@studio" />
          </Field>
        </CardContent>
      </Card>
    </div>
  ),
};
