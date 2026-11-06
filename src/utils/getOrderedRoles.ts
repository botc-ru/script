import type { Role } from '../types/Role'
import type { RolesById } from '../types/RolesById'
import type { ScriptData } from '../types/ScriptData'
import { compareBySao } from './compareBySao'

/**
 * Возвращает роли сценария в порядке показа: как в `roleIds` при `customOrder`, иначе по SAO.
 * Неизвестные роли пропускаются.
 */
export function getOrderedRoles(script: ScriptData, roles: RolesById): Role[] {
  const scriptRoles = script.roleIds.flatMap((id) => roles[id] ?? [])
  return script.customOrder ? scriptRoles : scriptRoles.sort(compareBySao)
}
