import type { RoleCardProps } from './RoleCardProps'

import './RoleCard.css'

/**
 * Карточка роли в две колонки: слева иконка, справа название и под ним описание.
 * Название окрашено в цвет команды роли.
 *
 * Если передан `onRemove`, карточка становится кнопкой: клик удаляет роль, а саму карточку
 * можно перетащить на другую. Карточка, на которую бросили роль, вызывает `onDropRole`.
 */
export function RoleCard({ role, onRemove, onDropRole }: RoleCardProps) {
  const className = role.team ? `role-card role-card--${role.team}` : 'role-card'
  const content = (
    <>
      <img className="role-card__icon" src={role.image} alt="" />
      <span className="role-card__text">
        <span className="role-card__name">{role.name}</span>
        <span className="role-card__ability">{role.ability}</span>
      </span>
    </>
  )

  if (!onRemove) return <div className={className}>{content}</div>

  return (
    <button
      type="button"
      className={className}
      draggable
      onClick={onRemove}
      onDragStart={(event) => event.dataTransfer.setData('text/plain', role.id)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        onDropRole?.(event.dataTransfer.getData('text/plain'))
      }}
    >
      {content}
    </button>
  )
}
