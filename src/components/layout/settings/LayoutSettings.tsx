import { FileDown } from 'lucide-react'

import type { FontScale } from '../../../types/FontScale'
import type { PlayersCount } from '../../../types/PlayersCount'
import type { PrintSettings } from '../../../types/PrintSettings'
import type { LayoutSettingsProps } from './LayoutSettingsProps'
import type { SettingOption } from './SettingOption'
import { SettingOptions } from './SettingOptions'
import { SettingToggle } from './SettingToggle'

import './LayoutSettings.css'

const FONT_SCALES: SettingOption<FontScale>[] = [
  { value: 0.85, label: 'S' },
  { value: 1, label: 'M' },
  { value: 1.15, label: 'L' },
]

const PLAYERS_COUNTS: SettingOption<PlayersCount>[] = [
  { value: '5-6', label: '5-6' },
  { value: '7+', label: '7+' },
]

const COLUMNS: SettingOption<1 | 2>[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
]

/**
 * Настройки макета: скачивание, общие настройки и группа на каждый лист.
 * Настройки листа видны, только пока лист включён.
 *
 * На ПК это столбец слева. На телефоне каждая настройка отдельная капсула в плавающей строке
 * над кнопками. Строка идёт от края до края экрана и листается, группы разделены линиями.
 * Скачивание на телефоне стоит внизу между кнопками.
 *
 * Без `onDownloadPdf` скачивание неактивно.
 */
export function LayoutSettings({ settings, onChange, onDownloadPdf }: LayoutSettingsProps) {
  function set(patch: Partial<PrintSettings>) {
    onChange({ ...settings, ...patch })
  }

  return (
    <div className="layout-settings">
      <button
        type="button"
        className="layout-settings__download"
        disabled={!onDownloadPdf}
        onClick={onDownloadPdf}
      >
        <FileDown size={16} aria-hidden />
        Скачать PDF
      </button>

      <div className="layout-settings__groups">
        <div className="layout-settings__group">
          <SettingOptions
            label="Шрифт"
            options={FONT_SCALES}
            value={settings.fontScale}
            onChange={(fontScale) => set({ fontScale })}
          />
          <SettingToggle
            label="Фон"
            value={settings.background}
            onChange={(background) => set({ background })}
          />
          <SettingToggle
            label="Логотип"
            value={settings.logo}
            onChange={(logo) => set({ logo })}
          />
          <SettingOptions
            label="Игроков"
            options={PLAYERS_COUNTS}
            value={settings.playersCount}
            onChange={(playersCount) => set({ playersCount })}
          />
        </div>

        <div className="layout-settings__group">
          <SettingToggle
            label="Список ролей"
            value={settings.playerSheet}
            isSheet
            onChange={(playerSheet) => set({ playerSheet })}
          />
          {settings.playerSheet && (
            <>
              <SettingToggle
                label="Растянуть"
                value={settings.stretch}
                onChange={(stretch) => set({ stretch })}
              />
              <SettingOptions
                label="Колонки"
                options={COLUMNS}
                value={settings.columns}
                onChange={(columns) => set({ columns })}
              />
            </>
          )}
        </div>

        <div className="layout-settings__group">
          <SettingToggle
            label="Лист рассказчика"
            value={settings.storytellerSheet}
            isSheet
            onChange={(storytellerSheet) => set({ storytellerSheet })}
          />
          {settings.storytellerSheet && (
            <>
              <SettingToggle
                label="Странники"
                value={settings.travellers}
                onChange={(travellers) => set({ travellers })}
              />
              <SettingToggle
                label="Таблица"
                value={settings.playersTable}
                onChange={(playersTable) => set({ playersTable })}
              />
              <SettingToggle
                label="Порядок ночи"
                value={settings.nightOrderColumns}
                onChange={(nightOrderColumns) => set({ nightOrderColumns })}
              />
            </>
          )}
        </div>

        <div className="layout-settings__group">
          <SettingToggle
            label="Подробная ночь"
            value={settings.nightOrder}
            isSheet
            onChange={(nightOrder) => set({ nightOrder })}
          />
        </div>
      </div>
    </div>
  )
}
