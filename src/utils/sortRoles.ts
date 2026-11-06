import type { Role } from '../types/Role'
import type { RoleSort } from '../types/RoleSort'
import type { Team } from '../types/Team'
import { TEAMS } from '../types/TeamOrder'
import { compareBySao } from './compareBySao'

function getTeamIndex(team?: Team): number {
  return team ? TEAMS.indexOf(team) : TEAMS.length
}

/** Возвращает новый список ролей: по алфавиту или по командам и порядку SAO внутри команды. */
export function sortRoles(roles: Role[], sort: RoleSort): Role[] {
  return [...roles].sort((a, b) => (sort === 'name'
    ? a.name.localeCompare(b.name, 'ru')
    : getTeamIndex(a.team) - getTeamIndex(b.team) || compareBySao(a, b)))
}
