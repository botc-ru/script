import type { PrintSettings } from '../types/PrintSettings'
import { DEFAULT_PRINT_SETTINGS } from './defaultPrintSettings'

const STORAGE_KEY = 'botc-print-settings'

const SETTING_OPTIONS: Record<string, unknown[] | undefined> = {
  fontScale: [0.85, 1, 1.15],
  playersCount: ['5-6', '7+'],
  columns: [1, 2],
  storytellerColumns: [1, 2],
}

function isValidSetting([key, value]: [string, unknown]) {
  return SETTING_OPTIONS[key]?.includes(value) ??
    (key in DEFAULT_PRINT_SETTINGS && typeof value === 'boolean')
}

/** Читает настройки макета. Повреждённые поля заменяются значениями по умолчанию. */
export function loadPrintSettings(): PrintSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PRINT_SETTINGS
    const saved = Object.entries(JSON.parse(raw) as Record<string, unknown>)

    return { ...DEFAULT_PRINT_SETTINGS, ...Object.fromEntries(saved.filter(isValidSetting)) }
  } catch {
    return DEFAULT_PRINT_SETTINGS
  }
}

/** Сохраняет настройки макета. Ошибки хранилища игнорируются: приложение работает и без него. */
export function savePrintSettings(settings: PrintSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Хранилище может быть недоступно или переполнено
  }
}
