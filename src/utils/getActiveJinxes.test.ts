import { describe, expect, it } from 'vitest'

import { TEST_ROLES } from '../test/testRoles'
import type { Role } from '../types/Role'
import { getActiveJinxes } from './getActiveJinxes'
import { getJinxPartners } from './getJinxPartners'

function getRole(id: string): Role {
  const role = TEST_ROLES[id]
  if (!role) throw new Error(`Unknown role ${id}`)
  return role
}

describe('getActiveJinxes', () => {
  it('возвращает пару один раз, хотя джинкс записан у обеих ролей', () => {
    const jinxes = getActiveJinxes([getRole('goon'), getRole('boffin')], TEST_ROLES)

    expect(jinxes).toHaveLength(1)
    expect(jinxes[0]?.reason).toBe('Правило Умника и Громилы')
  })

  it('не учитывает джинкс, если второй роли нет в сценарии', () => {
    expect(getActiveJinxes([getRole('goon')], TEST_ROLES)).toEqual([])
  })
})

describe('getJinxPartners', () => {
  it('находит партнёра с любой стороны пары', () => {
    const jinxes = getActiveJinxes([getRole('goon'), getRole('boffin')], TEST_ROLES)

    expect(getJinxPartners(getRole('goon'), jinxes)).toEqual([getRole('boffin')])
    expect(getJinxPartners(getRole('boffin'), jinxes)).toEqual([getRole('goon')])
    expect(getJinxPartners(getRole('chef'), jinxes)).toEqual([])
  })
})
