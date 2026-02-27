export const BUILT_IN_PROFILE_NAMES = ['public', 'dashboard', 'experimental'] as const;

export type BuiltInProfileName = (typeof BUILT_IN_PROFILE_NAMES)[number];
