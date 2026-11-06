import type { RolesState } from '../../../contexts/roles/RolesState'

export interface ToolbarSearchProps {
  roles: RolesState
  selectedRoleIds: string[]
  isClosing: boolean
  onToggleRole: (roleId: string) => void
  onClose: () => void
  onClosed: () => void
}
