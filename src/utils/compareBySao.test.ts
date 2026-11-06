import { describe, expect, it } from 'vitest'

import type { Role } from '../types/Role'
import { compareBySao } from './compareBySao'

function createRole(ability: string, name = 'Роль'): Role {
  return { id: name, name, ability, image: '', team: 'townsfolk' }
}

function sortAbilities(abilities: string[]) {
  return abilities
    .map((ability) => createRole(ability))
    .sort(compareBySao)
    .map((role) => role.ability)
}

describe('compareBySao', () => {
  it('сортирует по группам способностей', () => {
    const ordered = [
      'В первую ночь узнаёт число',
      'Каждую ночь выбирает игрока',
      'Каждую ночь* выбирает игрока',
      'Каждый день выбирает игрока',
      'Раз за игру ночью выбирает игрока',
      'Раз за игру днём выбирает игрока',
      'В первую ночь выбирает игрока',
      'Думает, что он Горожанин',
      'Когда умирает, узнаёт роль',
      'Если умер ночью, узнаёт роль',
      'Все игроки знают роль',
    ]

    expect(sortAbilities([...ordered].reverse())).toEqual(ordered)
  })

  it('Каждую ночь идёт раньше Каждую ночь*, даже если её текст длиннее', () => {
    expect(sortAbilities(['Каждую ночь* узнаёт', 'Каждую ночь выбирает двух игроков']))
      .toEqual(['Каждую ночь выбирает двух игроков', 'Каждую ночь* узнаёт'])
  })

  it('способность вне групп идёт последней', () => {
    expect(sortAbilities(['Необычная способность', 'Каждую ночь выбирает игрока']))
      .toEqual(['Каждую ночь выбирает игрока', 'Необычная способность'])
  })

  it('внутри группы короткая способность идёт раньше', () => {
    expect(sortAbilities(['Каждую ночь выбирает двух игроков', 'Каждую ночь выбирает']))
      .toEqual(['Каждую ночь выбирает', 'Каждую ночь выбирает двух игроков'])
  })

  it('при равной способности сравнивает длину и алфавит имён', () => {
    const roles = [createRole('Узнаёт', 'Яблоко'), createRole('Узнаёт', 'Ель'), createRole('Узнаёт', 'Дом')]

    expect(roles.sort(compareBySao).map((role) => role.name)).toEqual(['Дом', 'Ель', 'Яблоко'])
  })
})
