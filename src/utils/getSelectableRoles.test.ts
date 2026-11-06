import { describe, expect, it } from 'vitest'

import { getSelectableRoles } from './getSelectableRoles'

describe('getSelectableRoles', () => {
  it('оставляет только роли с командой', () => {
    const roles = getSelectableRoles({
      chef: { id: 'chef', name: 'Повар', ability: '', image: '', team: 'townsfolk' },
      dusk: { id: 'dusk', name: 'Закат', ability: '', image: '' },
    })

    expect(roles.map((role) => role.id)).toEqual(['chef'])
  })
})
