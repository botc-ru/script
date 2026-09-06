import type { ScriptData } from './scriptModel'

function buildScriptJsonContent({ name, author, roleIds }: ScriptData) {
  return [{ id: '_meta', name: name || 'Без названия', author }, ...roleIds]
}

export function downloadScriptJson(script: ScriptData) {
  const content = buildScriptJsonContent(script)
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${script.name || 'script'}.json`
  link.click()

  URL.revokeObjectURL(url)
}

export function copyScriptJson(script: ScriptData) {
  const content = buildScriptJsonContent(script)
  return navigator.clipboard.writeText(JSON.stringify(content, null, 2))
}
