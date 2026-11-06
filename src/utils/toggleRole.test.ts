import { describe, expect, it } from 'vitest'

import { TEST_ROLES } from '../test/testRoles'
import { DEFAULT_SCRIPT } from './defaultScript'
import { toggleRole } from './toggleRole'

function toggle(roleIds: string[], roleId: string) {
  return toggleRole({ ...DEFAULT_SCRIPT, roleIds }, roleId, TEST_ROLES).roleIds
}

describe('toggleRole', () => {
  it('удаляет существующую роль', () => {
    expect(toggle(['chef', 'imp'], 'chef')).toEqual(['imp'])
  })

  it('ставит новую роль перед ролью своей команды, которая идёт позже по SAO', () => {
    expect(toggle(['imp', 'librarian', 'drunk'], 'chef')).toEqual(['imp', 'chef', 'librarian', 'drunk'])
  })

  it('ставит роль в конец, если в команде нет ролей позже неё', () => {
    expect(toggle(['chef', 'imp'], 'librarian')).toEqual(['chef', 'imp', 'librarian'])
  })

  it('не смотрит на роли других команд', () => {
    expect(toggle(['imp', 'drunk'], 'chef')).toEqual(['imp', 'drunk', 'chef'])
  })

  it('неизвестную роль ставит в конец', () => {
    expect(toggle(['chef'], 'unknown')).toEqual(['chef', 'unknown'])
  })
})
