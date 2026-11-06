import { describe, expect, it } from 'vitest'

import type { Role } from '../types/Role'
import { searchRoles } from './searchRoles'

function createRole(id: string, name: string, ability = ''): Role {
  return { id, name, ability, image: '', team: 'townsfolk' }
}

const ROLES = [
  createRole('zealot', 'Аист', 'Демон выбирает'),
  createRole('hunter', 'Борец с демонами'),
  createRole('demon', 'Демон'),
  createRole('scholar', 'Учёный'),
]

function search(query: string) {
  return searchRoles(ROLES, query).map((role) => role.id)
}

describe('searchRoles', () => {
  it('пустой запрос ничего не находит', () => {
    expect(search('   ')).toEqual([])
  })

  it('сначала ставит начало названия, затем название, затем способность', () => {
    expect(search('демон')).toEqual(['demon', 'hunter', 'zealot'])
  })

  it('не зависит от регистра и пробелов по краям', () => {
    expect(search('  ДЕМОН ')).toHaveLength(3)
  })

  it('считает ё и е одной буквой', () => {
    expect(search('ученый')).toEqual(['scholar'])
    expect(search('учёный')).toEqual(['scholar'])
  })

  it('ищет по id', () => {
    expect(search('scholar')).toEqual(['scholar'])
  })

  it('не находит служебные записи без команды', () => {
    const service: Role = { id: 'dusk', name: 'Закат', ability: '', image: '' }

    expect(searchRoles([service], 'закат')).toEqual([])
  })
})
