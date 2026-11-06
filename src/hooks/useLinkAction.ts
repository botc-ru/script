import { useEffect, useRef, useState } from 'react'

/**
 * Выполняет действие из параметра `action` адреса, когда приложение готово.
 *
 * Действие срабатывает один раз, а параметр убирается из адреса:
 * иначе обновление страницы повторило бы его.
 */
export function useLinkAction(isReady: boolean, onAction: (action: string) => void) {
  const [action] = useState(() => new URLSearchParams(window.location.search).get('action'))
  const isDone = useRef(false)

  useEffect(() => {
    if (!action || !isReady || isDone.current) return
    isDone.current = true

    const params = new URLSearchParams(window.location.search)
    params.delete('action')
    const query = params.toString()
    window.history.replaceState(null, '', `${window.location.pathname}${query && `?${query}`}`)

    onAction(action)
  }, [action, isReady, onAction])
}
