import { useEffect, useState } from 'react'

import type { RolesState } from '../contexts/roles/RolesState'
import type { PrintSettings } from '../types/PrintSettings'
import type { ScriptData } from '../types/ScriptData'
import type { ScriptPdfData } from '../types/ScriptPdfData'
import { downloadBlob } from '../utils/downloadBlob'
import { getScriptTitle } from '../utils/getScriptTitle'
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
 * Новый запуск отменяет предыдущий: ещё не начатый запрос поток PDF пропускает, а результат
 * начатого отбрасывается. До завершения нового запуска остаётся прошлый результат:
 * превью не пропадает при правках.
 *
 * `download` скачивает готовый файл, если он соответствует текущим данным, иначе создаёт новый.
 * Его нет, пока скачать нечего: роли не загружены или все листы выключены. Ход создания
 * и ошибки передаются в `onNotify`.
 */
export function useScriptPdf(
  script: ScriptData,
  roles: RolesState,
  settings: PrintSettings,
  isActive: boolean,
  onNotify: (message: string) => void,
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
    const controller = new AbortController()
    const data = { script, roles: roles.roles, settings }
    const timer = setTimeout(() => {
      loadScriptPdf(data, controller.signal)
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
      controller.abort()
    }
  }, [script, roles, settings, isActive, isFresh, hasBlob])

  function download(ready: ScriptPdfData) {
    const fileName = `${getScriptTitle(script)}.pdf`
    if (blob && isFresh) {
      downloadBlob(fileName, blob)
      return
    }

    onNotify('Создаём PDF...')
    loadScriptPdf(ready)
      .then((nextBlob) => downloadBlob(fileName, nextBlob))
      .catch(() => onNotify('Не удалось создать PDF'))
  }

  const canDownload = roles.status === 'ready' && hasPdfPages(settings)

  return {
    blob,
    isFresh,
    isError,
    download: canDownload
      ? () => download({ script, roles: roles.roles, settings })
      : undefined,
  }
}
