import type { Jinx } from './Jinx'
import type { Team } from './Team'

export interface Role {
  id: string
  name: string
  /** У служебных записей порядка ночи (закат, рассвет) команды нет. */
  team?: Team
  ability: string
  image: string
  flavor?: string
  firstNight?: number
  firstNightReminder?: string
  otherNight?: number
  otherNightReminder?: string
  jinxes?: Jinx[]
  modifications?: string
}
