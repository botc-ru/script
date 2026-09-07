import type { FontScale, PlayersCount, PrintSettings } from './print'
import './PrintSettingsPanel.css'

const FONT_SCALES: { value: FontScale; label: string }[] = [
  { value: 0.85, label: 'S' },
  { value: 1, label: 'M' },
  { value: 1.15, label: 'L' },
]

const PLAYERS_COUNTS: PlayersCount[] = ['5-6', '7+']

interface PrintSettingsPanelProps {
  settings: PrintSettings
  onChange: (settings: PrintSettings) => void
  onDownloadPdf: () => void
}

export function PrintSettingsPanel({ settings, onChange, onDownloadPdf }: PrintSettingsPanelProps) {
  function set(patch: Partial<PrintSettings>) {
    onChange({ ...settings, ...patch })
  }

  function settingRow<T extends string | number | boolean>(
    label: string,
    options: { value: T; label: string }[],
    value: T,
    onChange: (value: T) => void,
  ) {
    return (
      <div className="print-settings__row">
        <span className="print-settings__label">{label}</span>
        <div className="print-settings__segmented">
          {options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              className={option.value === value ? 'active' : ''}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  function toggleGroup(label: string, value: boolean, onToggle: (value: boolean) => void) {
    return settingRow(
      label,
      [
        { value: true, label: 'Вкл' },
        { value: false, label: 'Выкл' },
      ],
      value,
      onToggle,
    )
  }

  return (
    <div className="print-settings">
      <div className="print-settings__section">
        <span className="print-settings__section-title">Документ</span>

        <button type="button" className="print-settings__download" onClick={onDownloadPdf}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v12" />
            <path d="M7 10l5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          Скачать PDF
        </button>

        {settingRow('Шрифт', FONT_SCALES, settings.fontScale, (fontScale) =>
          set({ fontScale }),
        )}

        {toggleGroup('Фон', settings.background, (background) => set({ background }))}
        {toggleGroup('Логотип', settings.logo, (logo) => set({ logo }))}

        {settingRow(
          '# Игроков',
          PLAYERS_COUNTS.map((count) => ({ value: count, label: count })),
          settings.playersCount,
          (playersCount) => set({ playersCount }),
        )}
      </div>

      <div className="print-settings__section">
        <label className="print-settings__section-title print-settings__section-title--toggle">
          <input
            type="checkbox"
            checked={settings.playerSheet}
            onChange={(event) => set({ playerSheet: event.target.checked })}
          />
          Список ролей
        </label>

        {settings.playerSheet && (
          <div className="print-settings__subgroup">
            {toggleGroup('Растянуть', settings.stretch, (stretch) => set({ stretch }))}

            {settingRow(
              'Колонки',
              ([1, 2] as const).map((columns) => ({ value: columns, label: String(columns) })),
              settings.columns,
              (columns) => set({ columns }),
            )}
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
          NPC и Странники
        </label>

        {settings.storytellerSheet && (
          <div className="print-settings__subgroup">
            {toggleGroup('Странники', settings.travellers, (travellers) => set({ travellers }))}
            {toggleGroup('Таблица', settings.playersTable, (playersTable) =>
              set({ playersTable }),
            )}
            {toggleGroup('Порядок ночи', settings.nightOrderColumns, (nightOrderColumns) =>
              set({ nightOrderColumns }),
            )}
          </div>
        )}
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
