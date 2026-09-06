import type { FontScale, PrintSettings } from './print'
import './PrintSettingsPanel.css'

const FONT_SCALES: { value: FontScale; label: string }[] = [
  { value: 0.85, label: 'S' },
  { value: 1, label: 'M' },
  { value: 1.15, label: 'L' },
]

interface PrintSettingsPanelProps {
  settings: PrintSettings
  onChange: (settings: PrintSettings) => void
}

export function PrintSettingsPanel({ settings, onChange }: PrintSettingsPanelProps) {
  function set(patch: Partial<PrintSettings>) {
    onChange({ ...settings, ...patch })
  }

  function toggleGroup(label: string, value: boolean, onToggle: (value: boolean) => void) {
    return (
      <div className="print-settings__group">
        <span className="print-settings__label">{label}</span>
        <div className="print-settings__buttons">
          <button type="button" className={value ? 'active' : ''} onClick={() => onToggle(true)}>
            Вкл
          </button>
          <button type="button" className={!value ? 'active' : ''} onClick={() => onToggle(false)}>
            Выкл
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="print-settings">
      <div className="print-settings__section">
        <span className="print-settings__section-title">Документ</span>

        <div className="print-settings__group">
          <span className="print-settings__label">Размер шрифта</span>
          <div className="print-settings__buttons">
            {FONT_SCALES.map((scale) => (
              <button
                key={scale.value}
                type="button"
                className={settings.fontScale === scale.value ? 'active' : ''}
                onClick={() => set({ fontScale: scale.value })}
              >
                {scale.label}
              </button>
            ))}
          </div>
        </div>

        {toggleGroup('Фон', settings.background, (background) => set({ background }))}
        {toggleGroup('Логотип', settings.logo, (logo) => set({ logo }))}
      </div>

      <div className="print-settings__section">
        <label className="print-settings__section-title print-settings__section-title--toggle">
          <input
            type="checkbox"
            checked={settings.playerSheet}
            onChange={(event) => set({ playerSheet: event.target.checked })}
          />
          Лист игрока
        </label>

        {settings.playerSheet && (
          <div className="print-settings__subgroup">
            {toggleGroup('Растянуть', settings.stretch, (stretch) => set({ stretch }))}

            <div className="print-settings__group">
              <span className="print-settings__label">Колонки</span>
              <div className="print-settings__buttons">
                {([1, 2] as const).map((columns) => (
                  <button
                    key={columns}
                    type="button"
                    className={settings.columns === columns ? 'active' : ''}
                    onClick={() => set({ columns })}
                  >
                    {columns}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="print-settings__section">
        <label className="print-settings__section-title print-settings__section-title--toggle">
          <input
            type="checkbox"
            checked={settings.storytellerSheet}
            onChange={(event) => set({ storytellerSheet: event.target.checked })}
          />
          Лист рассказчика
        </label>
      </div>

      <div className="print-settings__section">
        <label className="print-settings__section-title print-settings__section-title--toggle">
          <input
            type="checkbox"
            checked={settings.nightOrder}
            onChange={(event) => set({ nightOrder: event.target.checked })}
          />
          Порядок ночи
        </label>
      </div>
    </div>
  )
}
