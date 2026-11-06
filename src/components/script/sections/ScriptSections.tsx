import { Fragment } from 'react'

import type { Team } from '../../../types/Team'
import { TEAM_LABELS } from '../../../types/TeamLabels'
import { getActiveJinxes } from '../../../utils/getActiveJinxes'
import { getOrderedRoles } from '../../../utils/getOrderedRoles'
import { JinxSection } from '../jinxes/JinxSection'
import { ScriptSection } from '../section/ScriptSection'
import type { ScriptSectionsProps } from './ScriptSectionsProps'

const REQUIRED_TEAMS: Team[] = ['townsfolk', 'outsider', 'minion', 'demon']
const OPTIONAL_TEAMS: Team[] = ['loric', 'fabled', 'traveller']
const DJINN_ID = 'djinn'

/**
 * Секции сценария по командам. В режиме `edit` позволяет удалять и перетаскивать роли.
 *
 * Порядок секций строгий:
 * - Горожане, Изгои, Приспешники, Демоны показываются всегда, даже пустые.
 * - Летописцы, Сказочники, Правила Джинна, Странники скрываются, если пустые.
 *
 * Если в сценарии есть хотя бы один джинкс, первым Сказочником автоматически становится Джинн,
 * а после Сказочников появляются Правила Джинна.
 *
 * Без `customOrder` роли сортируются по SAO. Перетаскивание фиксирует текущий порядок
 * и включает `customOrder`.
 */
export function ScriptSections({ script, roles, mode, onChange }: ScriptSectionsProps) {
  const isEditing = mode === 'edit'
  const orderedRoles = getOrderedRoles(script, roles)
  const jinxes = getActiveJinxes(orderedRoles, roles)
  const djinn = jinxes.length > 0 ? roles[DJINN_ID] : undefined

  const sections = [...REQUIRED_TEAMS, ...OPTIONAL_TEAMS]
    .map((team) => ({
      team,
      teamRoles: orderedRoles.filter((role) => role.team === team && role !== djinn),
      pinnedRoles: team === 'fabled' && djinn ? [djinn] : [],
    }))
    .filter(({ team, teamRoles, pinnedRoles }) => (
      REQUIRED_TEAMS.includes(team) || teamRoles.length + pinnedRoles.length > 0
    ))

  function removeRole(roleId: string) {
    onChange?.({ roleIds: script.roleIds.filter((id) => id !== roleId) })
  }

  function moveRole(roleId: string, targetId: string) {
    const orderedIds = orderedRoles.map((role) => role.id)
    const roleIds = orderedIds.filter((id) => id !== roleId)
    roleIds.splice(orderedIds.indexOf(targetId), 0, roleId)
    onChange?.({ roleIds, customOrder: true })
  }

  return sections.map(({ team, teamRoles, pinnedRoles }) => (
    <Fragment key={team}>
      <ScriptSection
        title={TEAM_LABELS[team]}
        roles={teamRoles}
        pinnedRoles={pinnedRoles}
        jinxes={jinxes}
        onRemoveRole={isEditing ? removeRole : undefined}
        onMoveRole={isEditing ? moveRole : undefined}
      />
      {team === 'fabled' && jinxes.length > 0 && <JinxSection jinxes={jinxes} />}
    </Fragment>
  ))
}
