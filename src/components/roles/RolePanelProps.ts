import type { RolesState } from '../../contexts/roles/RolesState'

export interface RolePanelProps {
  roles: RolesState
  selectedRoleIds: string[]
  onToggleRole: (roleId: string) => void
}
