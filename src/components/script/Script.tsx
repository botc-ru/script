import type { Team } from '../../types/Team'
import { TEAM_LABELS } from '../../types/TeamLabels'
import { ScriptHeader } from './header/ScriptHeader'
import type { ScriptProps } from './ScriptProps'
import { ScriptSection } from './section/ScriptSection'

import './Script.css'

const REQUIRED_TEAMS: Team[] = ['townsfolk', 'outsider', 'minion', 'demon']
const OPTIONAL_TEAMS: Team[] = ['loric', 'fabled', 'traveller']

/**
 * Сценарий: заголовок с названием и автором, ниже секции с ролями.
 *
 * Режимы:
 * - `view`: только просмотр.
 * - `edit`: можно менять название, автора и цвет. Клик по роли удаляет её из сценария,
 *   перетаскивание меняет порядок ролей внутри секции.
 *
 * Порядок секций строгий:
 * - Горожане, Изгои, Приспешники, Демоны показываются всегда, даже пустые.
 * - Летописцы, Сказочники, Странники скрываются, если пустые.
 */
export function Script({ script, roles, mode, onChange }: ScriptProps) {
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

  return (
    <div className="script">
      <ScriptHeader script={script} mode={mode} onChange={onChange} />

      {sections.map(({ team, teamRoles }) => (
        <ScriptSection
          key={team}
          title={TEAM_LABELS[team]}
          roles={teamRoles}
          onRemoveRole={isEditing ? removeRole : undefined}
          onMoveRole={isEditing ? moveRole : undefined}
        />
      ))}
    </div>
  )
}
