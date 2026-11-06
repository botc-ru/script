import type { SettingOption } from './SettingOption'

export interface SettingOptionsProps<T> {
  label: string
  options: SettingOption<T>[]
  value: T
  onChange: (value: T) => void
}
