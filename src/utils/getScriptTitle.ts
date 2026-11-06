import type { ScriptData } from '../types/ScriptData'

/** Название сценария в PDF и в имени его файла. */
export function getScriptTitle(script: ScriptData): string {
  return script.name || 'Сценарий'
}
