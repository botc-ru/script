import type { Team } from './Team'

export const REQUIRED_TEAMS: Team[] = ['townsfolk', 'outsider', 'minion', 'demon']
export const OPTIONAL_TEAMS: Team[] = ['loric', 'fabled', 'traveller']
export const TEAMS: Team[] = [...REQUIRED_TEAMS, ...OPTIONAL_TEAMS]
