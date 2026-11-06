import type { RolesState } from '../../../contexts/roles/RolesState'
import type { Role } from '../../../types/Role'

export interface RoleListProps {
  status: RolesState['status']
  roles: Role[]
  selectedRoleIds: string[]
  onToggleRole: (roleId: string) => void
}
