import type { Role } from './types'

export function searchRoles(roles: Role[], query: string): Role[] {
  const trimmed = query.trim().toLowerCase()
  if (trimmed === '') return roles

  return roles.filter(
    (role) =>
      role.name.toLowerCase().includes(trimmed) ||
      role.ability.toLowerCase().includes(trimmed) ||
      role.id.toLowerCase().includes(trimmed),
  )
}
