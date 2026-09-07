export type FontScale = 0.85 | 1 | 1.15
export type PlayersCount = '5-6' | '7+'

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
}

export const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  fontScale: 1,
  background: true,
  logo: true,
  playersCount: '7+',
  playerSheet: true,
  stretch: true,
  columns: 2,
  storytellerSheet: true,
  travellers: true,
  playersTable: true,
  nightOrderColumns: true,
  nightOrder: true,
}
