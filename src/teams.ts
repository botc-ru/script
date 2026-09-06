import type { Team } from './types'

export const TEAM_LABELS: Record<Team, string> = {
  traveller: 'Странники',
  fabled: 'Сказочники',
  loric: 'Летописцы',
  townsfolk: 'Горожане',
  outsider: 'Изгои',
  minion: 'Приспешники',
  demon: 'Демоны',
}

export const TEAMS = Object.keys(TEAM_LABELS) as Team[]

export function getTeamIconUrl(team: Team): string {
  return `https://raw.githubusercontent.com/botc-ru/data/refs/heads/main/images/types/${team}.png`
}
