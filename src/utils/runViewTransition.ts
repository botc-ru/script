import { flushSync } from 'react-dom'

/** Применяет обновление состояния с анимацией. Без поддержки в браузере применяет его сразу. */
export function runViewTransition(update: () => void) {
  if (!('startViewTransition' in document)) {
    update()
    return
  }

  document.startViewTransition(() => {
    flushSync(update)
  })
}
