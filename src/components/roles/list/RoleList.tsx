import { RoleRow } from '../row/RoleRow'
import type { RoleListProps } from './RoleListProps'

import './RoleList.css'

/**
 * Список ролей для выбора. Показывает сообщения о загрузке, ошибке и пустом результате.
 */
export function RoleList({ status, roles, selectedRoleIds, onToggleRole }: RoleListProps) {
  return (
    <ul className="role-list">
      {status === 'loading' && <li className="role-list__message">Загрузка ролей...</li>}
      {status === 'error' && <li className="role-list__message">Не удалось загрузить роли</li>}
      {status === 'ready' && roles.length === 0 && (
        <li className="role-list__message">Ничего не найдено</li>
      )}
      {roles.map((role) => (
        <li key={role.id}>
          <RoleRow
            role={role}
            isSelected={selectedRoleIds.includes(role.id)}
            onClick={() => onToggleRole(role.id)}
          />
        </li>
      ))}
    </ul>
  )
}
