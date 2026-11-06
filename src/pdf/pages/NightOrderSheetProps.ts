import type { NightOrderEntry } from '../../types/NightOrderEntry'

export interface NightOrderSheetProps {
  title: string
  firstNight: NightOrderEntry[]
  otherNight: NightOrderEntry[]
}
