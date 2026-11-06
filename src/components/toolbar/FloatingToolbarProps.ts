import type { RolesState } from '../../contexts/roles/RolesState'
import type { ScriptData } from '../../types/ScriptData'
import type { ScriptMode } from '../../types/ScriptMode'

export interface FloatingToolbarProps {
  mode: ScriptMode
  onModeChange: (mode: ScriptMode) => void
  isRolesOpen: boolean
  onRolesOpenChange: (isOpen: boolean) => void
  roles: RolesState
  script: ScriptData
  onImport: (script: ScriptData) => void
  onNotify: (message: string) => void
  onToggleRole: (roleId: string) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}
