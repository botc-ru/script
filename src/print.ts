export type FontScale = 0.85 | 1 | 1.15

export interface PrintSettings {
  fontScale: FontScale
  background: boolean
  logo: boolean
  playerSheet: boolean
  stretch: boolean
  columns: 1 | 2
  storytellerSheet: boolean
  nightOrder: boolean
}

export const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  fontScale: 1,
  background: true,
  logo: true,
  playerSheet: true,
  stretch: true,
  columns: 2,
  storytellerSheet: true,
  nightOrder: true,
}
