import type { ScriptData } from '../types/ScriptData'
import { DEFAULT_SCRIPT } from './defaultScript'

function encodeQueryValue(value: string): string {
  return value
    .replace(/%/g, '%25')
    .replace(/&/g, '%26')
    .replace(/#/g, '%23')
    .replace(/\+/g, '%2B')
    .replace(/ /g, '%20')
}

/**
 * Раскодирует значение, которое закодировали повторно: так ссылку портят некоторые мессенджеры,
 * и `%20` приходит как `%2520`. Строку, которая не раскодируется, возвращает как есть.
 */
function decodeTwiceEncoded(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * Собирает query-строку сценария. Кириллица не кодируется, чтобы ссылка оставалась читаемой.
 */
export function buildScriptQuery(script: ScriptData): string {
  const { name, author, color, roleIds, customOrder } = script
  const params: [string, string][] = [
    ['title', name],
    ['author', author],
    ['color', color],
    ['roles', roleIds.join(',')],
    ['customOrder', customOrder ? 'true' : ''],
  ]

  return params
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeQueryValue(value)}`)
    .join('&')
}

/** Собирает полную ссылку на сценарий. */
export function buildScriptLink(script: ScriptData): string {
  const url = new URL(import.meta.env.BASE_URL, window.location.origin)
  return `${url.href}?${buildScriptQuery(script)}`
}

/**
 * Читает сценарий из query-строки. Ссылкой считается адрес с параметром `title` или `roles`.
 *
 * Наличие параметра `customOrder` отключает автоматическую сортировку ролей.
 * Повторно закодированные значения (`%2520` вместо `%20`) раскодируются ещё раз.
 */
export function readScriptFromLink(search: string): ScriptData | null {
  const params = new URLSearchParams(search)
  if (!params.has('roles') && !params.has('title')) return null

  function get(key: string): string | undefined {
    const value = params.get(key)
    return value === null ? undefined : decodeTwiceEncoded(value)
  }

  return {
    name: get('title') ?? DEFAULT_SCRIPT.name,
    author: get('author') ?? DEFAULT_SCRIPT.author,
    color: get('color') ?? DEFAULT_SCRIPT.color,
    roleIds: [...new Set(get('roles')?.split(',').filter(Boolean))],
    customOrder: params.has('customOrder'),
  }
}
