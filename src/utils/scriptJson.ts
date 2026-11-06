import type { ScriptData } from '../types/ScriptData'
import { DEFAULT_SCRIPT } from './defaultScript'

const META_ID = '_meta'

type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null
}

function getEntryId(entry: unknown): string | null {
  if (typeof entry === 'string') return entry
  return isRecord(entry) && typeof entry.id === 'string' ? entry.id : null
}

function getString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback
}

/**
 * Собирает JSON сценария в формате официального инструмента: массив с записью `_meta` и `id` ролей.
 * В `_meta` дополнительно хранятся цвет и `customOrder`.
 */
export function buildScriptJson({ name, author, color, roleIds, customOrder }: ScriptData): string {
  const meta = { id: META_ID, name, author, color, customOrder }
  return JSON.stringify([meta, ...roleIds], null, 2)
}

/**
 * Читает сценарий из JSON. Роли могут быть строками или объектами с полем `id`.
 * Возвращает `null`, если это не массив сценария.
 */
export function parseScriptJson(text: string): ScriptData | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return null
  }
  if (!Array.isArray(parsed)) return null

  const entries: unknown[] = parsed
  const meta = entries.find((entry) => getEntryId(entry) === META_ID)
  const { name, author, color, customOrder } = isRecord(meta) ? meta : {}
  const roleIds = entries.flatMap((entry) => {
    const id = getEntryId(entry)
    return id && id !== META_ID ? [id] : []
  })

  return {
    name: getString(name, DEFAULT_SCRIPT.name),
    author: getString(author, DEFAULT_SCRIPT.author),
    color: getString(color, DEFAULT_SCRIPT.color),
    roleIds: [...new Set(roleIds)],
    customOrder: customOrder === true,
  }
}
