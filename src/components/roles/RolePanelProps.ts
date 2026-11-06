import type { RolesState } from '../../contexts/roles/RolesState'
import type { TeamFilter } from '../../types/TeamFilter'

export interface RolePanelProps {
  roles: RolesState
  selectedRoleIds: string[]
  team: TeamFilter
  onTeamChange: (team: TeamFilter) => void
  onToggleRole: (roleId: string) => void
}
