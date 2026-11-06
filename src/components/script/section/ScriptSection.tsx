import { RoleCard } from '../role/RoleCard'
import type { ScriptSectionProps } from './ScriptSectionProps'

import './ScriptSection.css'

/**
 * Секция сценария: заголовок со счётчиком ролей и список ролей в две колонки.
 *
 * Роли заполняют сначала левую колонку, затем правую. На узком экране колонка одна.
 * Показывается и без ролей. Решение скрыть пустую секцию принимает `Script`.
 *
 * Если переданы `onRemoveRole` и `onMoveRole`, роли можно удалять и перетаскивать.
 * Перетащить роль можно только внутри секции.
 */
export function ScriptSection({ title, roles, onRemoveRole, onMoveRole }: ScriptSectionProps) {
  function handleDropRole(roleId: string, targetId: string) {
    if (roleId === targetId || !roles.some((role) => role.id === roleId)) return
    onMoveRole?.(roleId, targetId)
  }

  return (
    <section>
      <h2 className="script-section__title">{title} ({roles.length})</h2>
      <ul className="script-section__roles">
        {roles.map((role) => (
          <li key={role.id} className="script-section__role">
            <RoleCard
              role={role}
              onRemove={onRemoveRole && (() => onRemoveRole(role.id))}
              onDropRole={onMoveRole && ((roleId) => handleDropRole(roleId, role.id))}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
