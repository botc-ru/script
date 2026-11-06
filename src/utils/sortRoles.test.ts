import { describe, expect, it } from 'vitest'

import type { Role } from '../types/Role'
import { sortRoles } from './sortRoles'

const ROLES: Role[] = [
  { id: 'imp', name: 'Бес', ability: 'Убивает', image: '', team: 'demon' },
  { id: 'chef', name: 'Повар', ability: 'Узнаёт', image: '', team: 'townsfolk' },
  { id: 'drunk', name: 'Аист', ability: 'Не знает', image: '', team: 'outsider' },
]

describe('sortRoles', () => {
  it('сортирует по алфавиту', () => {
    expect(sortRoles(ROLES, 'name').map((role) => role.id)).toEqual(['drunk', 'imp', 'chef'])
  })

  it('сортирует по порядку команд', () => {
    expect(sortRoles(ROLES, 'sao').map((role) => role.id)).toEqual(['chef', 'drunk', 'imp'])
  })

  it('не меняет исходный список', () => {
    sortRoles(ROLES, 'name')

    expect(ROLES[0]?.id).toBe('imp')
  })
})
