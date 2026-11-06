import type { NightOrderEntry } from '../types/NightOrderEntry'
import type { Role } from '../types/Role'

/** Возвращает порядок первой или других ночей с подсказками. Роли без хода пропускаются. */
export function getNightOrder(roles: Role[], night: 'first' | 'other'): NightOrderEntry[] {
  const orderField = night === 'first' ? 'firstNight' : 'otherNight'
  const hintField = night === 'first' ? 'firstNightReminder' : 'otherNightReminder'

  return roles
    .filter((role) => role[orderField] !== undefined)
    .sort((a, b) => (a[orderField] ?? 0) - (b[orderField] ?? 0))
    .map((role) => ({ role, hint: role[hintField] }))
}
