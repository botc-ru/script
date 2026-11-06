import type { Role } from './Role'
import type { Team } from './Team'

export interface ScriptSectionData {
  team: Team
  roles: Role[]
  /** Роли в начале секции, которые нельзя удалить или перетащить. */
  pinnedRoles: Role[]
}
