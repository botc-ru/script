import { describe, expect, it } from 'vitest'

import { TEST_ROLES } from '../test/testRoles'
import type { ActiveJinx } from '../types/ActiveJinx'
import type { Role } from '../types/Role'
import { getScriptSections } from './getScriptSections'

function getRoles(...ids: string[]): Role[] {
  return ids.flatMap((id) => TEST_ROLES[id] ?? [])
}

const [boffin, goon] = getRoles('boffin', 'goon')
const JINXES = boffin && goon ? [{ roleA: boffin, roleB: goon, reason: '' }] : []

function getIds(roles: Role[], jinxes: ActiveJinx[] = []) {
  return getScriptSections(roles, jinxes, TEST_ROLES).map((section) => ({
    team: section.team,
    ids: section.roles.map((role) => role.id),
    pinnedIds: section.pinnedRoles.map((role) => role.id),
  }))
}

describe('getScriptSections', () => {
  it('всегда показывает основные команды и скрывает пустые остальные', () => {
    expect(getIds([]).map((section) => section.team))
      .toEqual(['townsfolk', 'outsider', 'minion', 'demon'])
  })

  it('добавляет непустые необязательные команды в строгом порядке', () => {
    expect(getIds(getRoles('beggar', 'ferryman', 'knaves')).map((section) => section.team))
      .toEqual(['townsfolk', 'outsider', 'minion', 'demon', 'loric', 'fabled', 'traveller'])
  })

  it('сохраняет порядок ролей внутри команды', () => {
    expect(getIds(getRoles('librarian', 'chef'))[0]?.ids).toEqual(['librarian', 'chef'])
  })

  it('при джинксах закрепляет Джинна, даже если его нет в сценарии', () => {
    expect(getIds(getRoles('ferryman'), JINXES).find((section) => section.team === 'fabled'))
      .toEqual({ team: 'fabled', ids: ['ferryman'], pinnedIds: ['djinn'] })
  })

  it('не повторяет Джинна, добавленного в сценарий', () => {
    expect(getIds(getRoles('djinn'), JINXES).find((section) => section.team === 'fabled'))
      .toEqual({ team: 'fabled', ids: [], pinnedIds: ['djinn'] })
  })

  it('без джинксов Джинн обычная роль', () => {
    expect(getIds(getRoles('djinn')).find((section) => section.team === 'fabled'))
      .toEqual({ team: 'fabled', ids: ['djinn'], pinnedIds: [] })
  })
})
