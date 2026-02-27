import type { BuiltInProfileName } from '../tokens/profile-names';
import { expandedVisionThemeIds, getVisionThemeIds } from './catalog';

export const VISION_SYSTEM_IDS = ['legacy', 'expanded', 'all'] as const;
export type VisionSystemId = (typeof VISION_SYSTEM_IDS)[number];

export type ProfileVisionAssignments = Record<BuiltInProfileName, string>;
export type ProfileVisionAssignmentOverrides = Partial<ProfileVisionAssignments>;

const LEGACY_VISION_THEME_IDS = [
  'museum',
  'brutalist',
  'immersive',
  'editorial',
  'zen',
  'synthwave',
  'aurora',
  'noir',
  'parchment',
  'terminal',
] as const;

const ALL_VISION_THEME_IDS = getVisionThemeIds();

const DEFAULT_PROFILE_VISION_ASSIGNMENTS: Record<VisionSystemId, ProfileVisionAssignments> = {
  legacy: {
    public: 'editorial',
    dashboard: 'terminal',
    experimental: 'brutalist',
  },
  expanded: {
    public: 'swiss_international',
    dashboard: 'raw_data',
    experimental: 'y2k_chrome',
  },
  all: {
    public: 'the_archive',
    dashboard: 'raw_data',
    experimental: 'immersive',
  },
};

export const DEFAULT_VISION_SYSTEM: VisionSystemId = 'all';

export function isVisionSystemId(value: string): value is VisionSystemId {
  return (VISION_SYSTEM_IDS as readonly string[]).includes(value);
}

export function getVisionSystemThemeIds(system: VisionSystemId): readonly string[] {
  if (system === 'legacy') {
    return LEGACY_VISION_THEME_IDS;
  }

  if (system === 'expanded') {
    return expandedVisionThemeIds;
  }

  return ALL_VISION_THEME_IDS;
}

export function getDefaultProfileVisionAssignments(system: VisionSystemId): ProfileVisionAssignments {
  return { ...DEFAULT_PROFILE_VISION_ASSIGNMENTS[system] };
}

export function resolveProfileVisionAssignments(
  system: VisionSystemId,
  overrides: ProfileVisionAssignmentOverrides = {},
): ProfileVisionAssignments {
  const allowed = new Set(getVisionSystemThemeIds(system));
  const next = { ...getDefaultProfileVisionAssignments(system), ...overrides };

  for (const [profile, visionId] of Object.entries(next)) {
    if (!allowed.has(visionId)) {
      throw new Error(
        `Vision "${visionId}" is not part of "${system}" vision system (profile: ${profile}).`,
      );
    }
  }

  return next;
}
