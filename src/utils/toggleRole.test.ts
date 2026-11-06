import { describe, expect, it } from 'vitest'

import { DEFAULT_SCRIPT } from './defaultScript'
import { toggleRole } from './toggleRole'

describe('toggleRole', () => {
  it('добавляет новую роль в конец', () => {
    const script = { ...DEFAULT_SCRIPT, roleIds: ['a'] }

    expect(toggleRole(script, 'b').roleIds).toEqual(['a', 'b'])
  })

  it('удаляет существующую роль', () => {
    const script = { ...DEFAULT_SCRIPT, roleIds: ['a', 'b'] }

    expect(toggleRole(script, 'a').roleIds).toEqual(['b'])
  })
})
