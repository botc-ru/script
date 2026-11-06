import type { ActiveJinx } from '../types/ActiveJinx'
import type { Role } from '../types/Role'
import type { RolesById } from '../types/RolesById'
import type { ScriptSectionData } from '../types/ScriptSectionData'
import { REQUIRED_TEAMS, TEAMS } from '../types/TeamOrder'

const DJINN_ID = 'djinn'

/**
 * Делит роли сценария на секции по командам. Общие правила для страницы и PDF:
 * - Основные команды есть всегда, даже пустые. Остальные скрываются, если пустые.
 * - Если есть джинксы, Джинн закреплён первым среди Сказочников.
 */
export function getScriptSections(
  orderedRoles: Role[],
  jinxes: ActiveJinx[],
  roles: RolesById,
): ScriptSectionData[] {
  const djinn = jinxes.length > 0 ? roles[DJINN_ID] : undefined

  return TEAMS
    .map((team) => ({
      team,
      roles: orderedRoles.filter((role) => role.team === team && role !== djinn),
      pinnedRoles: team === 'fabled' && djinn ? [djinn] : [],
    }))
    .filter((section) => (
      REQUIRED_TEAMS.includes(section.team) ||
      section.roles.length + section.pinnedRoles.length > 0
    ))
}
