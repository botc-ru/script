import type { ScriptData } from '../types/ScriptData'
import { parseScriptJson } from './scriptJson'
import { readScriptFromLink } from './scriptLink'

function getSearch(text: string): string {
  return URL.canParse(text) ? new URL(text).search : ''
}

/** Читает сценарий из текста: ссылки на сценарий или JSON. Возвращает `null`, если не распознан. */
export function parseScriptText(text: string): ScriptData | null {
  const trimmed = text.trim()
  return parseScriptJson(trimmed) ?? readScriptFromLink(getSearch(trimmed))
}
