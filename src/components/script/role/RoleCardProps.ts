import type { Role } from '../../../types/Role'

export interface RoleCardProps {
  role: Role
  onRemove?: () => void
  onDropRole?: (roleId: string) => void
}
