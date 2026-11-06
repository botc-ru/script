import { useEffect, useState } from 'react'

import type { RolesState } from '../contexts/roles/RolesState'
import type { PrintSettings } from '../types/PrintSettings'
import type { ScriptData } from '../types/ScriptData'
import { hasPdfPages } from '../utils/hasPdfPages'
import { loadScriptPdf } from '../utils/loadScriptPdf'

/** Пауза перед созданием PDF: быстрые переключения настроек дают один запуск. */
const GENERATE_DELAY = 200

/**
 * PDF сценария для превью. Пока `isActive` выключен, PDF не создаётся.
 *
 * Новый запуск отменяет предыдущий, а до его завершения остаётся прошлый результат:
 * превью не пропадает при правках.
 */
export function useScriptPdf(
  script: ScriptData,
  roles: RolesState,
  settings: PrintSettings,
  isActive: boolean,
) {
  const [blob, setBlob] = useState<Blob | null>(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!isActive || roles.status !== 'ready' || !hasPdfPages(settings)) return

    let isCurrent = true
    const timer = setTimeout(() => {
      loadScriptPdf({ script, roles: roles.roles, settings })
        .then((nextBlob) => {
          if (!isCurrent) return
          setBlob(nextBlob)
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
  }, [script, roles, settings, isActive])

  return { blob, isError }
}
