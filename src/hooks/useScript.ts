import { useEffect, useState } from 'react'

import { DEFAULT_SCRIPT } from '../utils/defaultScript'
import { buildScriptQuery, readScriptFromLink } from '../utils/scriptLink'
import { loadScript, saveScript } from '../utils/scriptStorage'
import { useHistoryState } from './useHistoryState'

/**
 * Текущий сценарий с историей изменений.
 *
 * При открытии берётся из ссылки, иначе из localStorage, иначе пустой. Каждое изменение
 * сохраняется в localStorage. Если сценарий открыт по ссылке, адрес обновляется вместе с ним:
 * ссылка важнее localStorage, и без этого обновление страницы отменяло бы правки.
 */
export function useScript() {
  const [linkScript] = useState(() => readScriptFromLink(window.location.search))
  const script = useHistoryState(() => linkScript ?? loadScript() ?? DEFAULT_SCRIPT)
  const isOpenedByLink = linkScript !== null

  useEffect(() => {
    saveScript(script.value)
    if (!isOpenedByLink) return

    const query = buildScriptQuery(script.value)
    window.history.replaceState(null, '', `${window.location.pathname}?${query}`)
  }, [script.value, isOpenedByLink])

  return script
}
