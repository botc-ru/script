import { SettingToggle } from './SettingToggle'
import type { SheetSettingsProps } from './SheetSettingsProps'

/** Группа настроек листа: переключатель листа и настройки, которые видны, пока он включён. */
export function SheetSettings({ label, value, onChange, children }: SheetSettingsProps) {
  return (
    <div className="layout-settings__group">
      <SettingToggle label={label} value={value} isSheet onChange={onChange} />
      {value && children}
    </div>
  )
}
