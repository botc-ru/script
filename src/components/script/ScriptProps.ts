import type { RolesState } from '../../contexts/roles/RolesState'
import type { ScriptData } from '../../types/ScriptData'
import type { ScriptMode } from '../../types/ScriptMode'
import type { Team } from '../../types/Team'

export interface ScriptProps {
  script: ScriptData
  roles: RolesState
  mode: ScriptMode
  onChange?: (patch: Partial<ScriptData>) => void
  onSelectTeam?: (team: Team) => void
}
