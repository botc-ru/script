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

/**
 * Читает сценарий из query-строки. Ссылкой считается адрес с параметром `title` или `roles`.
 *
 * Наличие параметра `customOrder` отключает автоматическую сортировку ролей.
 */
export function readScriptFromLink(search: string): ScriptData | null {
  const params = new URLSearchParams(search)
  if (!params.has('roles') && !params.has('title')) return null

  return {
    name: params.get('title') ?? DEFAULT_SCRIPT.name,
    author: params.get('author') ?? DEFAULT_SCRIPT.author,
    color: params.get('color') ?? DEFAULT_SCRIPT.color,
    roleIds: [...new Set(params.get('roles')?.split(',').filter(Boolean))],
    customOrder: params.has('customOrder'),
  }
}
