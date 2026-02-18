import { designPurposeOrder, designVariants } from './variants';
import type { DesignFeeling, DesignGoal, DesignIntent, DesignMode, DesignPurpose, DesignVariant } from './types';

function variantsList(): DesignVariant[] {
  return Object.values(designVariants);
}

export function getDesignVariant(mode: DesignMode): DesignVariant {
  return designVariants[mode];
}

export function getDesignStyle(mode: DesignMode, purpose: DesignPurpose): string {
  return designVariants[mode].purposeStyles[purpose];
}

export function getDesignStylesForMode(mode: DesignMode): Record<DesignPurpose, string> {
  return { ...designVariants[mode].purposeStyles };
}

export function resolveDesignMode(goal: DesignGoal, feeling: DesignFeeling): DesignMode | null {
  const variant = variantsList().find((item) => item.goal === goal && item.feeling === feeling);
  return variant?.mode ?? null;
}

export function getDesignStyleByIntent(intent: DesignIntent): string {
  const mode = resolveDesignMode(intent.goal, intent.feeling);
  if (!mode) {
    return '';
  }

  return getDesignStyle(mode, intent.purpose);
}

export function listDesignPurposes(): DesignPurpose[] {
  return [...designPurposeOrder];
}

export function listDesignVariants(): DesignVariant[] {
  return variantsList();
}
