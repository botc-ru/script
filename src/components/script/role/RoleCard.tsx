import { getTeamClass } from '../../../utils/getTeamClass'
import type { RoleCardProps } from './RoleCardProps'

import './RoleCard.css'

/**
 * Карточка роли в две колонки: слева иконка, справа название и под ним описание.
 * Название окрашено в цвет команды роли, справа от него иконки ролей из `jinxPartners`.
 * Модификации роли идут после описания жирным шрифтом в квадратных скобках.
 *
 * Если передан `onRemove`, карточка становится кнопкой: клик удаляет роль, а саму карточку
 * можно перетащить на другую. Карточка, на которую бросили роль, вызывает `onDropRole`.
 * Иначе при `isLink` карточка открывает страницу роли в вики.
 */
export function RoleCard({ role, jinxPartners = [], isLink, onRemove, onDropRole }: RoleCardProps) {
  const className = `role-card ${getTeamClass(role.team)}`
  const content = (
    <>
      <img className="role-card__icon" src={role.image} alt="" />
      <span className="role-card__text">
        <span className="role-card__title">
          <span className="role-card__name">{role.name}</span>
          {jinxPartners.map((partner) => (
            <img
              key={partner.id}
              className="role-card__jinx"
              src={partner.image}
              alt={`Джинкс: ${partner.name}`}
              title={partner.name}
            />
          ))}
        </span>
        <span className="role-card__ability">
          {role.ability}
          {role.modifications && (
            <span className="role-card__modifications"> [{role.modifications}]</span>
          )}
        </span>
      </span>
    </>
  )

  if (onRemove) {
    return (
      <button
        type="button"
        className={`${className} pressable`}
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

  if (isLink) {
    return (
      <a
        className={`${className} pressable`}
        href={`https://wiki.bloodontheclocktower.com/${role.id}`}
        target="_blank"
        rel="noreferrer"
      >
        {content}
      </a>
    )
  }

  return <div className={className}>{content}</div>
}
