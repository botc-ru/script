import type { ScriptData } from '../types/ScriptData'
import { DEFAULT_SCRIPT } from './defaultScript'

const STORAGE_KEY = 'botc-script'

/** Читает последний открытый сценарий. Повреждённые поля заменяются значениями по умолчанию. */
export function loadScript(): ScriptData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as Partial<Record<keyof ScriptData, unknown>>

    return {
      name: typeof saved.name === 'string' ? saved.name : DEFAULT_SCRIPT.name,
      author: typeof saved.author === 'string' ? saved.author : DEFAULT_SCRIPT.author,
      color: typeof saved.color === 'string' ? saved.color : DEFAULT_SCRIPT.color,
      roleIds: Array.isArray(saved.roleIds) ? saved.roleIds as string[] : DEFAULT_SCRIPT.roleIds,
      customOrder: saved.customOrder === true,
    }
  } catch {
    return null
  }
}

/** Сохраняет сценарий. Ошибки хранилища игнорируются: приложение работает и без него. */
export function saveScript(script: ScriptData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(script))
  } catch {
    // Хранилище может быть недоступно или переполнено
  }
}
