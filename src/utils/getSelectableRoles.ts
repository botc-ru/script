import type { Role } from '../types/Role'
import type { RolesById } from '../types/RolesById'

/** Возвращает роли, которые можно добавить в сценарий: без служебных записей порядка ночи. */
export function getSelectableRoles(roles: RolesById): Role[] {
  return Object.values(roles).filter((role) => role.team)
}
