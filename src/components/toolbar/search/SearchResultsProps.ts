import type { Role } from '../../../types/Role'

export interface SearchResultsProps {
  roles: Role[]
  selectedRoleIds: string[]
  onSelect: (roleId: string) => void
}
