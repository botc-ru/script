import type { Team } from '../types/Team'

export function getTeamIconUrl(team: Team): string {
  return `https://raw.githubusercontent.com/botc-ru/data/refs/heads/main/images/types/${team}.png`
}
