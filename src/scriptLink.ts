import { DEFAULT_SCRIPT_DATA, type ScriptData } from './scriptModel'
import { ROOT_PATH } from './routes'

function encodeQueryValue(value: string): string {
  return value.replace(/%/g, '%25').replace(/&/g, '%26').replace(/#/g, '%23').replace(/\+/g, '%2B')
}

export function buildScriptQuery(script: ScriptData): string {
  const params: [string, string][] = []
  if (script.name) params.push(['title', script.name])
  if (script.author) params.push(['author', script.author])
  if (script.color) params.push(['color', script.color])
  if (script.roleIds.length > 0) params.push(['roles', script.roleIds.join(',')])

  return params.map(([key, value]) => `${key}=${encodeQueryValue(value)}`).join('&')
}

export function buildScriptLink(script: ScriptData): string {
  const query = buildScriptQuery(script)
  const url = new URL(ROOT_PATH, window.location.origin)
  return query ? `${url.toString()}?${query}` : url.toString()
}

export function readScriptFromLink(): ScriptData | null {
  const params = new URLSearchParams(window.location.search)
  if (!params.has('roles') && !params.has('title')) return null

  const roles = params.get('roles')

  return {
    name: params.get('title') ?? DEFAULT_SCRIPT_DATA.name,
    author: params.get('author') ?? DEFAULT_SCRIPT_DATA.author,
    color: params.get('color') ?? DEFAULT_SCRIPT_DATA.color,
    roleIds: roles ? roles.split(',').filter(Boolean) : [],
  }
}
