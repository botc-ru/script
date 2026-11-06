import { Menu } from 'lucide-react'
import { useState } from 'react'

import { ToolbarButton } from '../button/ToolbarButton'
import type { ModeMenuProps } from './ModeMenuProps'

import './ModeMenu.css'

/**
 * Кнопка-гамбургер для телефона: открывает вверх меню с подписанными действиями.
 *
 * Текущий экран подсвечен. Меню закрывается после выбора пункта и повторным нажатием на кнопку.
 */
export function ModeMenu({ actions }: ModeMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mode-menu">
      {isOpen && (
        <ul className="mode-menu__list">
          {actions.map(({ icon: Icon, label, isActive, disabled, onClick }) => (
            <li key={label}>
              <button
                type="button"
                className="mode-menu__item"
                aria-current={isActive}
                disabled={disabled}
                onClick={() => {
                  onClick?.()
                  setIsOpen(false)
                }}
              >
                <Icon size={20} aria-hidden />
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <ToolbarButton icon={Menu} label="Меню" onClick={() => setIsOpen((open) => !open)} />
    </div>
  )
}
