import type { Role } from '../../../types/Role'

export interface RoleRowProps {
  role: Role
  isSelected: boolean
  onClick: () => void
}
