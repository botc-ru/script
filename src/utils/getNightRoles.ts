import type { PlayersCount } from '../types/PlayersCount'
import type { Role } from '../types/Role'
import type { RolesById } from '../types/RolesById'

const MINION_AND_DEMON_INFO = ['demoninfo', 'minioninfo']

/**
 * Возвращает записи порядка ночи: роли сценария и служебные записи без команды.
 * При 5-6 игроках Демон и Приспешники не узнают друг друга, их записи скрыты.
 */
export function getNightRoles(
  scriptRoles: Role[],
  roles: RolesById,
  playersCount: PlayersCount,
): Role[] {
  const serviceRoles = Object.values(roles).filter((role) => (
    !role.team && !(playersCount === '5-6' && MINION_AND_DEMON_INFO.includes(role.id))
  ))
  return [...scriptRoles, ...serviceRoles]
}
