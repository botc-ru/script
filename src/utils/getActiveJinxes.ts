import type { ActiveJinx } from '../types/ActiveJinx'
import type { Role } from '../types/Role'
import type { RolesById } from '../types/RolesById'

/**
 * Возвращает джинксы между ролями сценария, каждую пару один раз.
 *
 * В данных джинкс записан у обеих ролей пары.
 */
export function getActiveJinxes(scriptRoles: Role[], roles: RolesById): ActiveJinx[] {
  const scriptIds = new Set(scriptRoles.map((role) => role.id))
  const seenPairs = new Set<string>()

  return scriptRoles.flatMap((roleA) => (roleA.jinxes ?? []).flatMap(({ id, reason }) => {
    const roleB = roles[id]
    const pair = [roleA.id, id].sort().join('|')
    if (!roleB || !scriptIds.has(id) || seenPairs.has(pair)) return []

    seenPairs.add(pair)
    return [{ roleA, roleB, reason }]
  }))
}
