import type { Role } from '../../../types/Role'
import { getJinxPartners } from '../../../utils/getJinxPartners'
import { RoleCard } from '../role/RoleCard'
import type { ScriptSectionProps } from './ScriptSectionProps'
import { SectionTitle } from './SectionTitle'

import './ScriptSection.css'

/**
 * Секция сценария: заголовок со счётчиком ролей и список ролей в две колонки.
 *
 * Роли заполняют сначала левую колонку, затем правую. На узком экране колонка одна.
 * Показывается и без ролей. Решение скрыть пустую секцию принимает `ScriptSections`.
 *
 * Если переданы `onRemoveRole` и `onMoveRole`, роли можно удалять и перетаскивать внутри секции.
 * Иначе карточки ведут на вики. `pinnedRoles` идут первыми, удалить и перетащить их нельзя.
 */
export function ScriptSection({
  title,
  roles,
  pinnedRoles = [],
  jinxes,
  onRemoveRole,
  onMoveRole,
}: ScriptSectionProps) {
  function handleDropRole(roleId: string, targetId: string) {
    if (roleId === targetId || !roles.some((role) => role.id === roleId)) return
    onMoveRole?.(roleId, targetId)
  }

  function renderRole(role: Role, isPinned: boolean) {
    return (
      <li key={role.id} className="script-section__role">
        <RoleCard
          role={role}
          jinxPartners={getJinxPartners(role, jinxes)}
          isLink={!onRemoveRole}
          onRemove={!isPinned && onRemoveRole ? () => onRemoveRole(role.id) : undefined}
          onDropRole={!isPinned && onMoveRole
            ? (roleId) => handleDropRole(roleId, role.id)
            : undefined}
        />
      </li>
    )
  }

  return (
    <section>
      <SectionTitle title={title} count={pinnedRoles.length + roles.length} />
      <ul className="script-section__roles">
        {pinnedRoles.map((role) => renderRole(role, true))}
        {roles.map((role) => renderRole(role, false))}
      </ul>
    </section>
  )
}
