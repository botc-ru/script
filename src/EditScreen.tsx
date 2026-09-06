import { RolePanel, type TeamFilter } from './RolePanel'
import { ScriptPanel } from './ScriptPanel'
import type { ScriptMeta } from './scriptModel'
import type { Role, RolesById } from './types'
import './App.css'

interface EditScreenProps {
  roles: RolesById
  loading: boolean
  error: string | null
  scriptRoles: Role[]
  showRolePanel: boolean
  teamFilter: TeamFilter
  onTeamFilterChange: (team: TeamFilter) => void
  onSelectRole: (role: Role) => void
  script: ScriptMeta
  onScriptChange: (patch: Partial<ScriptMeta>) => void
  onRemove: (roleId: string) => void
  onReorder: (draggedId: string, targetId: string) => void
}

export function EditScreen({
  roles,
  loading,
  error,
  scriptRoles,
  showRolePanel,
  teamFilter,
  onTeamFilterChange,
  onSelectRole,
  script,
  onScriptChange,
  onRemove,
  onReorder,
}: EditScreenProps) {
  const scriptRoleIds = new Set(scriptRoles.map((role) => role.id))

  return (
    <div className={`app${showRolePanel ? ' app--role-panel-open' : ''}`}>
      {showRolePanel && (
        <RolePanel
          roles={roles}
          loading={loading}
          error={error}
          onSelect={onSelectRole}
          selectedRoleIds={scriptRoleIds}
          onDeselect={onRemove}
          teamFilter={teamFilter}
          onTeamFilterChange={onTeamFilterChange}
        />
      )}

      <ScriptPanel
        roles={scriptRoles}
        allRoles={roles}
        script={script}
        onScriptChange={onScriptChange}
        onRemove={onRemove}
        onSelectTeam={onTeamFilterChange}
        onReorder={onReorder}
      />
    </div>
  )
}
