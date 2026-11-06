import { Check } from 'lucide-react'

import type { SettingToggleProps } from './SettingToggleProps'

import './SettingToggle.css'

/**
 * Кнопка-переключатель настройки макета. Состояние показывает отметка: кружок с галочкой
 * или пустое кольцо. Только по цвету его на телефоне не всегда видно.
 *
 * Переключатель листа (`isSheet`) выделен жирным шрифтом: цвет кнопки занят главной кнопкой.
 */
export function SettingToggle({ label, value, isSheet, onChange }: SettingToggleProps) {
  const className = `setting-toggle${isSheet ? ' setting-toggle--sheet' : ''}`

  return (
    <button
      type="button"
      className={className}
      aria-pressed={value}
      onClick={() => onChange(!value)}
    >
      <span className="setting-toggle__mark">
        {value && <Check size={12} strokeWidth={3} aria-hidden />}
      </span>
      {label}
    </button>
  )
}
