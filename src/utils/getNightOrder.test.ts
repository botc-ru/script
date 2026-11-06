import { describe, expect, it } from 'vitest'

import type { Role } from '../types/Role'
import { getNightOrder } from './getNightOrder'
import { getNightRoles } from './getNightRoles'

function createRole(id: string, fields: Partial<Role>): Role {
  return { id, name: id, ability: '', image: '', team: 'townsfolk', ...fields }
}

const LATE = createRole('late', { firstNight: 20, firstNightReminder: 'Поздно', otherNight: 1 })
const EARLY = createRole('early', { firstNight: 10, otherNight: 2, otherNightReminder: 'Рано' })
const DAY = createRole('day', {})

describe('getNightOrder', () => {
  it('сортирует первую ночь и берёт её подсказки', () => {
    expect(getNightOrder([LATE, EARLY, DAY], 'first')).toEqual([
      { role: EARLY, hint: undefined },
      { role: LATE, hint: 'Поздно' },
    ])
  })

  it('сортирует остальные ночи и берёт их подсказки', () => {
    expect(getNightOrder([EARLY, LATE, DAY], 'other')).toEqual([
      { role: LATE, hint: undefined },
      { role: EARLY, hint: 'Рано' },
    ])
  })

  it('не меняет исходный список', () => {
    const roles = [LATE, EARLY]

    getNightOrder(roles, 'first')

    expect(roles).toEqual([LATE, EARLY])
  })
})

describe('getNightRoles', () => {
  const ROLES = {
    late: LATE,
    day: DAY,
    dusk: createRole('dusk', { team: undefined }),
    demoninfo: createRole('demoninfo', { team: undefined }),
    minioninfo: createRole('minioninfo', { team: undefined }),
  }

  function getIds(playersCount: '5-6' | '7+') {
    return getNightRoles([LATE], ROLES, playersCount).map((role) => role.id)
  }

  it('добавляет к ролям сценария только служебные записи', () => {
    expect(getIds('7+')).toEqual(['late', 'dusk', 'demoninfo', 'minioninfo'])
  })

  it('при 5-6 игроках скрывает информацию для Демона и Приспешников', () => {
    expect(getIds('5-6')).toEqual(['late', 'dusk'])
  })
})
