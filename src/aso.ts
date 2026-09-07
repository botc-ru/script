import type { Role, Team } from './types'

// Реализация официального порядка сортировки (Sort Order / ASO):
// https://bloodontheclocktower.com/blogs/news/sort-order-sao-update
// Персонажи группируются по типу способности (текстовые шаблоны),
// внутри группы — по длине текста способности, затем по длине имени,
// затем по алфавиту. Оригинальный алгоритм основан на английских
// формулировках способностей, поэтому шаблоны ниже адаптированы под
// типичные русские переводы. Из-за различий в переводе некоторые
// способности не попадают ни в одну группу — они сортируются в
// отдельной последней группе только по длине текста.
const ABILITY_GROUPS: RegExp[] = [
  /^В\s+первую\s+ночь\s+узна/, // "You start knowing"
  /^(Каждую\s+ночь|В\s+ночь\s+X)/, // "Each night"
  /^Каждый\s+день/, // "Each day"
  /^Раз\s+за\s+игру\s+ночью/, // "Once per game, at night"
  /^Раз\s+за\s+игру\s+днём/, // "Once per game, during the day"
  /^(Раз\s+за\s+игру|Один\s+раз\s+за\s+игру)/, // "Once per game"
  /^В\s+первую\s+ночь/, // "On your 1st night"
  /^(В\s+(первый|последний)\s+день|На\s+\S+\s+день)/, // "On your 1st day" (+ другие фиксированные дни)
  /^Думает,?\s+что/, // "You think"
  /^(Способности\s+других\s+игроков\s+могут\s+считать\s+его|Является|Защищён)/, // "You are"
  /^(Имеет|Получает)/, // "You have"
  /^Не\s+знает/, // "You do not know"
  /^Может\b/, // "You might"
  /^Когда\s+умирает/, // "When you die"
  /^Когда/, // "When"
  /^Если\s+умер/, // "If you die"
  /^Если\s+Демон/, // "If the Demon..."
  /^Если\s+в\s+(живых|игре)/, // "If there are N players alive"
  /^Если/, // "If"
  /^Все\s+игроки/, // "All players"
  /^Все\b/, // "All"
  /^(Игроки\b|[А-ЯЁ][а-яё]+(\s+[а-яё]+)?\s+игроки\b)/, // "Players"
  /^Приспешники\b/, // "Minions"
  /^Перв(ые|ый)/, // "The 1st time"
  /^(В\s+игре|Есть)\b/, // не из оригинального списка: глобальные условия сценария
  /^Рассказчик\b/, // не из оригинального списка: способности, управляемые Рассказчиком
  /^Каждый\b/, // не из оригинального списка: остальные периодические способности
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
