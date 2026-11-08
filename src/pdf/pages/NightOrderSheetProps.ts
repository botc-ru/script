import type { NightOrderEntry } from '../../types/NightOrderEntry'

export interface NightOrderSheetProps {
  title: string
  /** Цвет названия сценария. */
  color: string
  firstNight: NightOrderEntry[]
  otherNight: NightOrderEntry[]
}
