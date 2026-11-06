import type { SettingToggleProps } from './SettingToggleProps'

import './SettingToggle.css'

/** Кнопка-переключатель настройки макета. Включённое состояние подсвечено. */
export function SettingToggle({ label, value, isSheet, onChange }: SettingToggleProps) {
  const className = `setting-toggle${isSheet ? ' setting-toggle--sheet' : ''}`

  return (
    <button
      type="button"
      className={className}
      aria-pressed={value}
      onClick={() => onChange(!value)}
    >
      {label}
    </button>
  )
}
