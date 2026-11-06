import { useEffect, useState } from 'react'

import type { RolesState } from '../contexts/roles/RolesState'
import type { PrintSettings } from '../types/PrintSettings'
import type { ScriptData } from '../types/ScriptData'
import type { ScriptPdfData } from '../types/ScriptPdfData'
import { hasPdfPages } from '../utils/hasPdfPages'
import { loadScriptPdf } from '../utils/loadScriptPdf'

/** Пауза перед созданием PDF: быстрые переключения настроек дают один запуск. */
const GENERATE_DELAY = 200

/**
 * PDF сценария для превью и скачивания.
 *
 * Первый раз создаётся сразу после загрузки ролей, чтобы Макет открывался без ожидания.
 * Дальше обновляется, только пока `isActive`: правки вне Макета подхватываются при его открытии.
 *
 * Новый запуск отменяет предыдущий, а до его завершения остаётся прошлый результат:
 * превью не пропадает при правках. `isFresh` говорит, что `blob` соответствует текущим данным.
 */
export function useScriptPdf(
  script: ScriptData,
  roles: RolesState,
  settings: PrintSettings,
  isActive: boolean,
) {
  const [blob, setBlob] = useState<Blob | null>(null)
  const [source, setSource] = useState<ScriptPdfData | null>(null)
  const [isError, setIsError] = useState(false)

  const isFresh = roles.status === 'ready' &&
    source?.script === script &&
    source.roles === roles.roles &&
    source.settings === settings
  const hasBlob = blob !== null

  useEffect(() => {
    if (roles.status !== 'ready' || !hasPdfPages(settings)) return
    if (isFresh || (hasBlob && !isActive)) return

    let isCurrent = true
    const data = { script, roles: roles.roles, settings }
    const timer = setTimeout(() => {
      loadScriptPdf(data)
        .then((nextBlob) => {
          if (!isCurrent) return
          setBlob(nextBlob)
          setSource(data)
          setIsError(false)
        })
        .catch(() => {
          if (isCurrent) setIsError(true)
        })
    }, GENERATE_DELAY)

    return () => {
      isCurrent = false
      clearTimeout(timer)
    }
  }, [script, roles, settings, isActive, isFresh, hasBlob])

  return { blob, isFresh, isError }
}
