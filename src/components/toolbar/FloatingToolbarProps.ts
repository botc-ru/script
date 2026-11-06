import type { ScriptMode } from '../../types/ScriptMode'

export interface FloatingToolbarProps {
  mode: ScriptMode
  onModeChange: (mode: ScriptMode) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}
