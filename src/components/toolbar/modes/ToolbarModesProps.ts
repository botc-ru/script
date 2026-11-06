import type { AppScreen } from '../../../types/AppScreen'
import type { ScriptMode } from '../../../types/ScriptMode'

export interface ToolbarModesProps {
  mode: ScriptMode
  screen: AppScreen
  onModeChange: (mode: ScriptMode) => void
  onScreenChange: (screen: AppScreen) => void
}
