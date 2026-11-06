export interface SettingToggleProps {
  label: string
  value: boolean
  /** Переключатель целого листа: начало группы настроек. */
  isSheet?: boolean
  onChange: (value: boolean) => void
}
