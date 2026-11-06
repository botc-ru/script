import { use } from 'react'

import { PdfSettingsContext } from './PdfSettingsContext'
import { mm } from './units'

/** Возвращает функцию: размер шрифта в миллиметрах с учётом настройки масштаба. */
export function useFontSize() {
  const { fontScale } = use(PdfSettingsContext)
  return (size: number) => mm(size) * fontScale
}
