import type { Team } from '../types/Team'

/** Возвращает класс, который задаёт переменную `--team-color`. */
export function getTeamClass(team?: Team): string {
  return team ? `team--${team}` : ''
}
