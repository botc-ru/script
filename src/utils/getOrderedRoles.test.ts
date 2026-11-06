import { describe, expect, it } from 'vitest'

import type { Role } from '../types/Role'
import { DEFAULT_SCRIPT } from './defaultScript'
import { getOrderedRoles } from './getOrderedRoles'

function createRole(id: string, ability: string): Role {
  return { id, name: id, ability, image: '', team: 'townsfolk' }
}

const ROLES = {
  each: createRole('each', 'Каждую ночь узнаёт'),
  first: createRole('first', 'В первую ночь узнаёт'),
  other: createRole('other', 'Не относится к группам'),
}

describe('getOrderedRoles', () => {
  it('сортирует по группам способностей SAO', () => {
    const script = { ...DEFAULT_SCRIPT, roleIds: ['other', 'each', 'first'] }

    expect(getOrderedRoles(script, ROLES).map((role) => role.id))
      .toEqual(['first', 'each', 'other'])
  })

  it('с customOrder сохраняет порядок', () => {
    const script = { ...DEFAULT_SCRIPT, roleIds: ['other', 'each', 'first'], customOrder: true }

    expect(getOrderedRoles(script, ROLES).map((role) => role.id))
      .toEqual(['other', 'each', 'first'])
  })

  it('пропускает неизвестные роли', () => {
    const script = { ...DEFAULT_SCRIPT, roleIds: ['unknown', 'each'] }

    expect(getOrderedRoles(script, ROLES).map((role) => role.id)).toEqual(['each'])
  })
})
