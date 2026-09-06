export type Team =
  | 'townsfolk'
  | 'outsider'
  | 'minion'
  | 'demon'
  | 'traveller'
  | 'fabled'
  | 'loric'

export interface Jinx {
  id: string
  reason: string
}

export interface Role {
  id: string
  name: string
  team: Team
  ability: string
  image: string
  flavor?: string
  firstNight?: number
  firstNightReminder?: string
  otherNight?: number
  otherNightReminder?: string
  jinxes?: Jinx[]
}

export type RolesById = Record<string, Role>
