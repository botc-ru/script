import type { Role } from '../types/Role'

function normalize(text: string): string {
  return text.toLowerCase().replaceAll('ё', 'е')
}

function getRank(role: Role, query: string): number {
  const name = normalize(role.name)
  if (name.startsWith(query)) return 0
  if (name.includes(query)) return 1
  return normalize(role.ability).includes(query) || role.id.includes(query) ? 2 : -1
}

/**
 * Ищет роли по названию, способности и id без учёта регистра, `ё` и `е` считаются одной буквой.
 *
 * Сначала идут роли, чьё название начинается с запроса, затем содержит его, затем остальные
 * совпадения. Внутри группы роли упорядочены по алфавиту. Служебные записи без команды
 * не участвуют.
 */
export function searchRoles(roles: Role[], query: string): Role[] {
  const normalizedQuery = normalize(query.trim())
  if (!normalizedQuery) return []

  return roles
    .filter((role) => role.team)
    .map((role) => ({ role, rank: getRank(role, normalizedQuery) }))
    .filter(({ rank }) => rank >= 0)
    .sort((a, b) => a.rank - b.rank || a.role.name.localeCompare(b.role.name, 'ru'))
    .map(({ role }) => role)
}
