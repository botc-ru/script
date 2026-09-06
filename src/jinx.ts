import type { Role, RolesById } from './types'

export interface ActiveJinx {
  roleA: Role
  roleB: Role
  reason: string
}

export function getActiveJinxes(scriptRoles: Role[], allRoles: RolesById): ActiveJinx[] {
  const scriptIds = new Set(scriptRoles.map((role) => role.id))
  const seen = new Set<string>()
  const result: ActiveJinx[] = []

  for (const role of scriptRoles) {
    for (const jinx of role.jinxes ?? []) {
      if (!scriptIds.has(jinx.id)) continue
      const key = [role.id, jinx.id].sort().join('|')
      if (seen.has(key)) continue
      seen.add(key)
      result.push({ roleA: role, roleB: allRoles[jinx.id], reason: jinx.reason })
    }
  }

  return result
}
