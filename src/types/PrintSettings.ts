import type { FontScale } from './FontScale'
import type { PlayersCount } from './PlayersCount'

export interface PrintSettings {
  fontScale: FontScale
  background: boolean
  logo: boolean
  playersCount: PlayersCount
  playerSheet: boolean
  stretch: boolean
  columns: 1 | 2
  storytellerSheet: boolean
  travellers: boolean
  playersTable: boolean
  nightOrderColumns: boolean
  nightOrder: boolean
  nightHints: boolean
}
