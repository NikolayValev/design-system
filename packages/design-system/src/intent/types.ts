export type DesignMode = 'lab' | 'pop' | 'zen' | 'museum' | 'brutal' | 'immersive';

export type DesignGoal = 'competence' | 'joy' | 'peace' | 'permanence' | 'rebellion' | 'immersion';

export type DesignFeeling = 'precision' | 'euphoria' | 'serenity' | 'reverence' | 'defiance' | 'transcendence';

export type DesignPurpose =
  | 'theme-wrapper'
  | 'nav-container'
  | 'active-tab'
  | 'card'
  | 'label'
  | 'button-primary'
  | 'button-secondary'
  | 'button-icon'
  | 'input-field'
  | 'input-range'
  | 'status-indicator'
  | 'surface'
  | 'layout-container'
  | 'feature-container';

export interface DesignIntent {
  goal: DesignGoal;
  feeling: DesignFeeling;
  purpose: DesignPurpose;
}

export interface DesignVariant {
  mode: DesignMode;
  label: string;
  environment: string;
  source: 'emotional-systems' | 'design-research-1';
  goal: DesignGoal;
  feeling: DesignFeeling;
  purposeStyles: Record<DesignPurpose, string>;
}
