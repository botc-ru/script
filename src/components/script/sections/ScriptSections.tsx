import type { Team } from '../../../types/Team'
import { TEAM_LABELS } from '../../../types/TeamLabels'
import { ScriptSection } from '../section/ScriptSection'
import type { ScriptSectionsProps } from './ScriptSectionsProps'

const REQUIRED_TEAMS: Team[] = ['townsfolk', 'outsider', 'minion', 'demon']
const OPTIONAL_TEAMS: Team[] = ['loric', 'fabled', 'traveller']

/**
 * Секции сценария по командам. В режиме `edit` позволяет удалять и перетаскивать роли.
 *
 * Порядок секций строгий:
 * - Горожане, Изгои, Приспешники, Демоны показываются всегда, даже пустые.
 * - Летописцы, Сказочники, Странники скрываются, если пустые.
 */
export function ScriptSections({ script, roles, mode, onChange }: ScriptSectionsProps) {
  const isEditing = mode === 'edit'
  const scriptRoles = script.roleIds.flatMap((id) => roles[id] ?? [])
  const sections = [...REQUIRED_TEAMS, ...OPTIONAL_TEAMS]
    .map((team) => ({ team, teamRoles: scriptRoles.filter((role) => role.team === team) }))
    .filter(({ team, teamRoles }) => REQUIRED_TEAMS.includes(team) || teamRoles.length > 0)

  function removeRole(roleId: string) {
    onChange?.({ roleIds: script.roleIds.filter((id) => id !== roleId) })
  }

  function moveRole(roleId: string, targetId: string) {
    const roleIds = script.roleIds.filter((id) => id !== roleId)
    roleIds.splice(script.roleIds.indexOf(targetId), 0, roleId)
    onChange?.({ roleIds })
  }

  return sections.map(({ team, teamRoles }) => (
    <ScriptSection
      key={team}
      title={TEAM_LABELS[team]}
      roles={teamRoles}
      onRemoveRole={isEditing ? removeRole : undefined}
      onMoveRole={isEditing ? moveRole : undefined}
    />
  ))
}
