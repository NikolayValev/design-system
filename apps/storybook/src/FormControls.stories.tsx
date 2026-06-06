import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Textarea,
} from '@nikolayvalev/design-system';

/**
 * Form Controls — Label, Input, Textarea, and Checkbox share one token-driven
 * state model (hover, focus-visible ring, disabled, aria-invalid).
 */
function FormControlsShowcase(): JSX.Element {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Contact details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="fc-name">Full name</Label>
          <Input id="fc-name" placeholder="Ada Lovelace" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fc-email">Email</Label>
          <Input id="fc-email" type="email" defaultValue="not-an-email" aria-invalid />
          <p className="text-xs [color:var(--vde-color-danger)]">Enter a valid email address.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fc-message">Message</Label>
          <Textarea id="fc-message" placeholder="How can we help?" rows={4} />
        </div>

        <Label htmlFor="fc-terms">
          <Checkbox id="fc-terms" defaultChecked />
          <span>Email me product updates</span>
        </Label>

        <div className="flex items-center justify-end gap-3 border-t pt-4 [border-color:var(--vde-color-border)]">
          <Button variant="ghost">Cancel</Button>
          <Button variant="default">Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}

const meta = {
  title: 'Components/Form Controls',
  component: FormControlsShowcase,
  parameters: {
    storyCaption: 'Label, Input, Textarea, and Checkbox composed into a realistic form with an invalid field.',
    docs: {
      description: {
        component:
          'The form primitives share a consistent state model — hover, focus-visible ring from --vde-color-ring, disabled, and aria-invalid (danger border/ring).',
      },
    },
  },
} satisfies Meta<typeof FormControlsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="st-default">Default</Label>
        <Input id="st-default" placeholder="Type here" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="st-invalid">Invalid</Label>
        <Input id="st-invalid" defaultValue="bad value" aria-invalid />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="st-disabled">Disabled</Label>
        <Input id="st-disabled" placeholder="Disabled" disabled />
      </div>
    </div>
  ),
};
