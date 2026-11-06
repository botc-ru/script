import { useState } from 'react'

import { ToolbarButton } from '../button/ToolbarButton'
import type { PopupMenuProps } from './PopupMenuProps'

import './PopupMenu.css'

/**
 * Плавающая кнопка с выпадающим меню. Пункты разбиты на группы, у группы может быть заголовок.
 *
 * На ПК меню открывается вниз, на телефоне вверх. Текущий пункт (`isActive`) подсвечен.
 * Меню закрывается после выбора пункта и повторным нажатием на кнопку.
 */
export function PopupMenu({ icon, label, groups, align }: PopupMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="popup-menu">
      {isOpen && (
        <div className={`popup-menu__panel popup-menu__panel--${align}`}>
          {groups.map(({ title, actions }) => (
            <div key={title ?? 'main'}>
              {title && <div className="popup-menu__title">{title}</div>}
              <ul className="popup-menu__list">
                {actions.map(({ icon: Icon, label: actionLabel, isActive, disabled, onClick }) => (
                  <li key={actionLabel}>
                    <button
                      type="button"
                      className="popup-menu__item"
                      aria-current={isActive}
                      disabled={disabled}
                      onClick={() => {
                        onClick?.()
                        setIsOpen(false)
                      }}
                    >
                      <Icon size={20} aria-hidden />
                      {actionLabel}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <ToolbarButton icon={icon} label={label} onClick={() => setIsOpen((open) => !open)} />
    </div>
  )
}
