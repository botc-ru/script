import { getTeamClass } from '../../../utils/getTeamClass'
import type { RoleRowProps } from './RoleRowProps'

import './RoleRow.css'

/**
 * Строка роли в списках выбора: слева иконка, справа название в цвете команды.
 *
 * Роль, которая уже есть в сценарии (`isSelected`), подсвечена фоном.
 */
export function RoleRow({ role, isSelected, onClick }: RoleRowProps) {
  return (
    <button
      type="button"
      className={`role-row pressable ${getTeamClass(role.team)}`}
      aria-pressed={isSelected}
      onClick={onClick}
    >
      <img className="role-row__icon" src={role.image} alt="" loading="lazy" decoding="async" />
      <span className="role-row__name">{role.name}</span>
    </button>
  )
}
