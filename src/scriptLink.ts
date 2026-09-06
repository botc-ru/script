import { DEFAULT_SCRIPT_DATA, type ScriptData } from './scriptModel'
import { ROOT_PATH } from './routes'

export function buildScriptLink(script: ScriptData): string {
  const params = new URLSearchParams()
  if (script.name) params.set('title', script.name)
  if (script.author) params.set('author', script.author)
  if (script.color) params.set('color', script.color)
  if (script.roleIds.length > 0) params.set('roles', script.roleIds.join(','))

  const url = new URL(ROOT_PATH, window.location.origin)
  url.search = params.toString()
  return url.toString()
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
