import type { Project } from '../types';

export type ProjectInventoryMode = 'Primary' | 'Resale' | 'Rental';

export interface ProjectInventoryModeDefaults {
  segment: string;
  presentStatus: NonNullable<Project['presentStatus']>;
  handoverStatus: NonNullable<Project['handoverStatus']>;
}

const MODE_DEFAULTS: Record<ProjectInventoryMode, ProjectInventoryModeDefaults> = {
  Primary: { segment: 'Luxury', presentStatus: 'Under Construction', handoverStatus: 'Under Construction' },
  Resale: { segment: 'Prime Resale', presentStatus: 'Ready to Move-IN', handoverStatus: 'Ready to Move' },
  Rental: { segment: 'Verified Rental', presentStatus: 'Ready to Move-IN', handoverStatus: 'Ready to Move' }
};

export function resolveProjectInventoryMode(projectType?: string | null, fallbackMode: ProjectInventoryMode = 'Primary'): ProjectInventoryMode {
  const normalized = String(projectType || '').trim().toLowerCase().replace(/[_-]+/g, ' ');
  if (normalized === 'rental' || normalized === 'rent') return 'Rental';
  if (normalized === 'resale') return 'Resale';
  if (normalized === 'primary' || normalized === 'primary sale') return 'Primary';
  return fallbackMode;
}

export function getProjectInventoryModeDefaults(mode: ProjectInventoryMode): ProjectInventoryModeDefaults {
  return MODE_DEFAULTS[mode];
}

/** Replace untouched mode defaults while preserving values deliberately entered by the admin. */
export function transitionProjectInventoryMode(draft: Partial<Project>, currentMode: ProjectInventoryMode, nextMode: ProjectInventoryMode): Partial<Project> {
  if (currentMode === nextMode) return { ...draft, type: nextMode };
  const before = MODE_DEFAULTS[currentMode];
  const after = MODE_DEFAULTS[nextMode];
  const replaceDefault = (value: string | undefined, oldValue: string, newValue: string) => !value || value === oldValue ? newValue : value;
  const nextDraft: Partial<Project> = {
    ...draft,
    type: nextMode,
    segment: replaceDefault(draft.segment, before.segment, after.segment),
    presentStatus: replaceDefault(draft.presentStatus, before.presentStatus, after.presentStatus),
    handoverStatus: replaceDefault(draft.handoverStatus, before.handoverStatus, after.handoverStatus)
  };
  // Monthly rent and sale price share form fields; don't carry rent into resale or primary.
  if ((currentMode === 'Rental') !== (nextMode === 'Rental')) {
    nextDraft.price = '';
    nextDraft.lastPrice = '';
  }
  return nextDraft;
}
