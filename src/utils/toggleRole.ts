import type { ScriptData } from '../types/ScriptData'

/** Добавляет роль в конец сценария, а если она уже есть, удаляет. */
export function toggleRole(script: ScriptData, roleId: string): ScriptData {
  const roleIds = script.roleIds.includes(roleId)
    ? script.roleIds.filter((id) => id !== roleId)
    : [...script.roleIds, roleId]

  return { ...script, roleIds }
}
