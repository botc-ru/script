import type { ActiveJinx } from '../types/ActiveJinx'
import type { Role } from '../types/Role'

/** Возвращает роли, с которыми у роли есть активный джинкс. */
export function getJinxPartners(role: Role, jinxes: ActiveJinx[]): Role[] {
  return jinxes.flatMap(({ roleA, roleB }) => {
    if (roleA.id === role.id) return [roleB]
    return roleB.id === role.id ? [roleA] : []
  })
}
