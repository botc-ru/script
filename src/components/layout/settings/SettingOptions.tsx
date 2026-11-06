import type { SettingOptionsProps } from './SettingOptionsProps'

import './SettingOptions.css'

/** Настройка макета с несколькими вариантами: подпись и кнопка на каждый вариант. */
export function SettingOptions<T>({ label, options, value, onChange }: SettingOptionsProps<T>) {
  return (
    <div className="setting-options" role="group" aria-label={label}>
      <span className="setting-options__label">{label}</span>
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          className="setting-options__button pressable"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
