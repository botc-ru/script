import type { RolesById } from '../types/RolesById'

function normalize(id: string): string {
  return id.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Приводит `id` ролей из чужого сценария к `id` приложения: в других инструментах они могут
 * отличаться регистром и разделителями (`fortune_teller` и `fortuneteller`).
 * Неизвестные `id` остаются без изменений.
 */
export function resolveRoleIds(roleIds: string[], roles: RolesById): string[] {
  const knownIds = new Map(Object.keys(roles).map((id) => [normalize(id), id]))
  const resolved = roleIds.map((id) => (roles[id] ? id : knownIds.get(normalize(id)) ?? id))
  return [...new Set(resolved)]
}
