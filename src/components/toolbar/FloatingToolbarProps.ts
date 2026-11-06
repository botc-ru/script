import type { RolesState } from '../../contexts/roles/RolesState'
import type { ScriptMode } from '../../types/ScriptMode'

export interface FloatingToolbarProps {
  mode: ScriptMode
  onModeChange: (mode: ScriptMode) => void
  roles: RolesState
  selectedRoleIds: string[]
  onToggleRole: (roleId: string) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}
