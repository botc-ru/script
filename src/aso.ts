import type { Role, Team } from './types'

const ABILITY_GROUPS: RegExp[] = [
  /^В\s+первую\s+ночь\s+узна/,
  /^(Каждую\s+ночь|В\s+ночь\s+X)/,
  /^Каждый\s+день/,
  /^Раз\s+за\s+игру\s+ночью/,
  /^Раз\s+за\s+игру\s+днём/,
  /^(Раз\s+за\s+игру|Один\s+раз\s+за\s+игру)/,
  /^В\s+первую\s+ночь/,
  /^(В\s+(первый|последний)\s+день|На\s+\S+\s+день)/,
  /^Думает,?\s+что/,
  /^(Способности\s+других\s+игроков\s+могут\s+считать\s+его|Является|Защищён)/,
  /^(Имеет|Получает)/,
  /^Не\s+знает/,
  /^Может\b/,
  /^Когда\s+умирает/,
  /^Когда/,
  /^Если\s+умер/,
  /^Если\s+Демон/,
  /^Если\s+в\s+(живых|игре)/,
  /^Если/,
  /^Все\s+игроки/,
  /^Все\b/,
  /^(Игроки\b|[А-ЯЁ][а-яё]+(\s+[а-яё]+)?\s+игроки\b)/,
  /^Приспешники\b/,
  /^Перв(ые|ый)/,
  /^(В\s+игре|Есть)\b/,
  /^Рассказчик\b/,
  /^Каждый\b/,
]

const TEAM_ORDER: Record<Team, number> = {
  townsfolk: 0,
  outsider: 1,
  minion: 2,
  demon: 3,
  traveller: 4,
  fabled: 5,
  loric: 6,
}

function abilityGroupIndex(ability: string): number {
  const index = ABILITY_GROUPS.findIndex((pattern) => pattern.test(ability))
  return index === -1 ? ABILITY_GROUPS.length : index
}

export function compareByAso(a: Role, b: Role): number {
  const team = (a.team ? TEAM_ORDER[a.team] : 0) - (b.team ? TEAM_ORDER[b.team] : 0)
  if (team !== 0) return team

  const group = abilityGroupIndex(a.ability) - abilityGroupIndex(b.ability)
  if (group !== 0) return group

  const length = a.ability.length - b.ability.length
  if (length !== 0) return length

  const nameLength = a.name.length - b.name.length
  if (nameLength !== 0) return nameLength

  return a.name.localeCompare(b.name, 'ru')
}
