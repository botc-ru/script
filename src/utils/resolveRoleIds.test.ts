import { describe, expect, it } from 'vitest'

import { TEST_ROLES } from '../test/testRoles'
import { resolveRoleIds } from './resolveRoleIds'

describe('resolveRoleIds', () => {
  it('сопоставляет id с другим регистром и разделителями', () => {
    expect(resolveRoleIds(['Lib_rarian', 'CHEF'], TEST_ROLES)).toEqual(['librarian', 'chef'])
  })

  it('оставляет неизвестные id и убирает повторы', () => {
    expect(resolveRoleIds(['unknown', 'chef', 'CHEF'], TEST_ROLES)).toEqual(['unknown', 'chef'])
  })
})
