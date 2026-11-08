import type { Style } from '@react-pdf/types'

/** Читает стиль, который подмена `@react-pdf/renderer` в тесте записала в `data-style`. */
export function readPdfStyle(element: Element | null): Style {
  if (!(element instanceof HTMLElement)) throw new Error('элемент не найден')
  return JSON.parse(element.dataset.style ?? '{}') as Style
}
