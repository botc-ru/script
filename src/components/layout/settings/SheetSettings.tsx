import { SettingToggle } from './SettingToggle'
import type { SheetSettingsProps } from './SheetSettingsProps'

/**
 * Группа настроек листа: переключатель листа и настройки, которые видны, пока он включён.
 * Настройки листа идут с отступом слева: так видно, к чему они относятся.
 *
 * Настройки выключенного листа остаются в разметке: иначе их нельзя плавно свернуть
 * к заголовку листа. Пока они свёрнуты, с ними нельзя взаимодействовать (`inert`).
 */
export function SheetSettings({ label, value, onChange, children }: SheetSettingsProps) {
  const foldClassName = [
    'layout-settings__sheet-fold',
    !value && 'layout-settings__sheet-fold--closed',
  ].filter(Boolean).join(' ')

  return (
    <div className="layout-settings__group layout-settings__group--sheet">
      <SettingToggle label={label} value={value} isSheet onChange={onChange} />
      <div className={foldClassName} inert={!value}>
        <div className="layout-settings__sheet-options">{children}</div>
      </div>
    </div>
  )
}
