import type { Team } from '../types/Team'

/** Возвращает адрес иконки команды в репозитории `botc-ru/data`. */
export function getTeamIconUrl(team: Team): string {
  return `https://raw.githubusercontent.com/botc-ru/data/refs/heads/main/images/types/${team}.png`
}
