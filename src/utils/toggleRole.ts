import type { RolesById } from '../types/RolesById'
import type { ScriptData } from '../types/ScriptData'
import { compareBySao } from './compareBySao'

function getInsertIndex(roleIds: string[], roleId: string, roles: RolesById): number {
  const role = roles[roleId]
  if (!role) return roleIds.length

  const index = roleIds.findIndex((id) => {
    const other = roles[id]
    return other !== undefined && other.team === role.team && compareBySao(role, other) < 0
  })
  return index === -1 ? roleIds.length : index
}

/**
 * Добавляет роль в сценарий, а если она уже есть, удаляет.
 *
 * Новая роль встаёт перед первой ролью своей команды, которая идёт после неё по SAO.
 * Так она оказывается на своём месте и при ручном порядке. Если такой нет, роль идёт в конец.
 */
export function toggleRole(script: ScriptData, roleId: string, roles: RolesById): ScriptData {
  if (script.roleIds.includes(roleId)) {
    return { ...script, roleIds: script.roleIds.filter((id) => id !== roleId) }
  }

  const roleIds = [...script.roleIds]
  roleIds.splice(getInsertIndex(roleIds, roleId, roles), 0, roleId)
  return { ...script, roleIds }
}
