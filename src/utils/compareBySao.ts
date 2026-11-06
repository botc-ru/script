import type { Role } from '../types/Role'

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

function getAbilityGroup(ability: string): number {
  const index = ABILITY_GROUPS.findIndex((pattern) => pattern.test(ability))
  return index === -1 ? ABILITY_GROUPS.length : index
}

/**
 * Сравнивает две роли одной команды по порядку SAO: группа способности, её длина, имя.
 *
 * Группы подобраны под русские переводы способностей.
 */
export function compareBySao(a: Role, b: Role): number {
  return getAbilityGroup(a.ability) - getAbilityGroup(b.ability) ||
    a.ability.length - b.ability.length ||
    a.name.length - b.name.length ||
    a.name.localeCompare(b.name, 'ru')
}
