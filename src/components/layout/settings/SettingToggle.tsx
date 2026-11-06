import { Check } from 'lucide-react'

import type { SettingToggleProps } from './SettingToggleProps'

import './SettingToggle.css'

/**
 * Кнопка-переключатель настройки макета. Состояние показывает отметка справа: кружок с галочкой
 * или пустое кольцо. Только по цвету его на телефоне не всегда видно. Отметка стоит после
 * подписи, чтобы подписи всех настроек начинались на одной линии.
 *
 * Переключатель листа (`isSheet`) выделен жирным шрифтом: цвет кнопки занят главной кнопкой.
 */
export function SettingToggle({ label, value, isSheet, onChange }: SettingToggleProps) {
  const className = `setting-toggle pressable${isSheet ? ' setting-toggle--sheet' : ''}`

  return (
    <button
      type="button"
      className={className}
      aria-pressed={value}
      onClick={() => onChange(!value)}
    >
      {label}
      <span className="setting-toggle__mark">
        {value && <Check size={12} strokeWidth={3} aria-hidden />}
      </span>
    </button>
  )
}
