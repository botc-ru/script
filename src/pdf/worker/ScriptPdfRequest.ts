import type { PrintSettings } from '../../types/PrintSettings'
import type { RolesById } from '../../types/RolesById'
import type { ScriptData } from '../../types/ScriptData'

/**
 * Сообщение потоку PDF: создать файл или отменить запрос, который ещё не начат.
 * Роли передаются, только если изменились с прошлого запроса: поток запоминает последние.
 */
export type ScriptPdfRequest =
  | { type: 'generate', id: number, script: ScriptData, settings: PrintSettings, roles?: RolesById }
  | { type: 'cancel', id: number }
