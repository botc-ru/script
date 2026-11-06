import type { ActiveJinx } from '../../types/ActiveJinx'
import type { NightOrderEntry } from '../../types/NightOrderEntry'
import type { ScriptSectionData } from '../../types/ScriptSectionData'

export interface StorytellerSheetProps {
  title: string
  author: string
  sections: ScriptSectionData[]
  jinxes: ActiveJinx[]
  firstNight: NightOrderEntry[]
  otherNight: NightOrderEntry[]
}
