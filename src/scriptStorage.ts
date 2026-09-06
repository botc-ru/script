import { DEFAULT_SCRIPT_DATA, type ScriptData } from './scriptModel'

const STORAGE_KEY = 'botc-script'

export function loadScript(): ScriptData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SCRIPT_DATA
    const parsed = JSON.parse(raw)
    return {
      name: typeof parsed.name === 'string' ? parsed.name : DEFAULT_SCRIPT_DATA.name,
      author: typeof parsed.author === 'string' ? parsed.author : DEFAULT_SCRIPT_DATA.author,
      color: typeof parsed.color === 'string' ? parsed.color : DEFAULT_SCRIPT_DATA.color,
      roleIds: Array.isArray(parsed.roleIds) ? parsed.roleIds : DEFAULT_SCRIPT_DATA.roleIds,
    }
  } catch {
    return DEFAULT_SCRIPT_DATA
  }
}

export function saveScript(script: ScriptData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(script))
  } catch {
    // localStorage может быть недоступен (приватный режим, квота) — тихо игнорируем
  }
}
