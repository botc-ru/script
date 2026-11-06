import type { ActiveJinx } from '../../types/ActiveJinx'
import type { ScriptData } from '../../types/ScriptData'
import type { ScriptSectionData } from '../../types/ScriptSectionData'

export interface PlayerSheetProps {
  title: string
  script: ScriptData
  sections: ScriptSectionData[]
  jinxes: ActiveJinx[]
}
