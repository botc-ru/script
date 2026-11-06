import { Fragment } from 'react'

import { TEAM_LABELS } from '../../../types/TeamLabels'
import { getActiveJinxes } from '../../../utils/getActiveJinxes'
import { getOrderedRoles } from '../../../utils/getOrderedRoles'
import { getScriptSections } from '../../../utils/getScriptSections'
import { JinxSection } from '../jinxes/JinxSection'
import { ScriptSection } from '../section/ScriptSection'
import type { ScriptSectionsProps } from './ScriptSectionsProps'

/**
 * Секции сценария по командам. В режиме `edit` позволяет удалять и перетаскивать роли,
 * а клик по заголовку секции вызывает `onSelectTeam` с её командой.
 *
 * Состав секций задаёт `getScriptSections`. Если в сценарии есть хотя бы один джинкс,
 * после Сказочников появляются Правила Джинна.
 *
 * Без `customOrder` роли сортируются по SAO. Перетаскивание фиксирует текущий порядок
 * и включает `customOrder`.
 */
export function ScriptSections({
  script,
  roles,
  mode,
  onChange,
  onSelectTeam,
}: ScriptSectionsProps) {
  const isEditing = mode === 'edit'
  const orderedRoles = getOrderedRoles(script, roles)
  const jinxes = getActiveJinxes(orderedRoles, roles)
  const sections = getScriptSections(orderedRoles, jinxes, roles)

  function removeRole(roleId: string) {
    onChange?.({ roleIds: script.roleIds.filter((id) => id !== roleId) })
  }

  function moveRole(roleId: string, targetId: string) {
    const orderedIds = orderedRoles.map((role) => role.id)
    const roleIds = orderedIds.filter((id) => id !== roleId)
    roleIds.splice(orderedIds.indexOf(targetId), 0, roleId)
    onChange?.({ roleIds, customOrder: true })
  }

  return sections.map(({ team, roles: teamRoles, pinnedRoles }) => (
    <Fragment key={team}>
      <ScriptSection
        title={TEAM_LABELS[team]}
        roles={teamRoles}
        pinnedRoles={pinnedRoles}
        jinxes={jinxes}
        onRemoveRole={isEditing ? removeRole : undefined}
        onMoveRole={isEditing ? moveRole : undefined}
        onTitleClick={isEditing ? () => onSelectTeam?.(team) : undefined}
      />
      {team === 'fabled' && jinxes.length > 0 && <JinxSection jinxes={jinxes} />}
    </Fragment>
  ))
}
