import type { Role, Team } from './types'

export const TEAM_PRINT_COLOR: Partial<Record<Team, string>> = {
  townsfolk: '#0066bb',
  outsider: '#0066bb',
  minion: '#aa2211',
  demon: '#aa2211',
  traveller: '#550044',
  fabled: '#776644',
}

const PLAYER_COUNTS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

export const PLAYERS_COUNT_TABLE = {
  players: PLAYER_COUNTS,
  townsfolk: [3, 3, 5, 5, 5, 7, 7, 7, 9, 9, 9],
  outsider: [0, 1, 0, 1, 2, 0, 1, 2, 0, 1, 2],
  minion: [1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3],
  demon: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
}

export interface NightOrderEntry {
  role: Role
  hint?: string
}

export function getNightOrder(roles: Role[], key: 'first' | 'other'): NightOrderEntry[] {
  const numberField = key === 'first' ? 'firstNight' : 'otherNight'
  const hintField = key === 'first' ? 'firstNightReminder' : 'otherNightReminder'

  return roles
    .filter((role) => role[numberField] !== undefined)
    .sort((a, b) => (a[numberField] as number) - (b[numberField] as number))
    .map((role) => ({ role, hint: role[hintField] }))
}

export function splitIntoColumns<T>(items: T[], columns: number): T[][] {
  const perColumn = Math.ceil(items.length / columns) || 1
  return Array.from({ length: columns }, (_, index) =>
    items.slice(index * perColumn, (index + 1) * perColumn),
  )
}
