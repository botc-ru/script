import { StyleSheet } from '@react-pdf/renderer'

import { PDF_ACCENT_COLOR } from '../pdfColors'
import { useFontSize } from '../useFontSize'
import { Bold } from './Bold'
import type { NightTitleProps } from './NightTitleProps'

const styles = StyleSheet.create({
  title: {
    color: PDF_ACCENT_COLOR,
    textTransform: 'uppercase',
  },
})

/**
 * Заголовок колонки порядка ночи: «Первая ночь» или «Другие ночи».
 * Общий для листа рассказчика и подробного порядка ночи, чтобы размер совпадал.
 * Размер подобран так, чтобы при крупном шрифте заголовок помещался в узкую колонку в одну строку.
 */
export function NightTitle({ title }: NightTitleProps) {
  const fontSize = useFontSize()
  return <Bold style={[styles.title, { fontSize: fontSize(3.2) }]}>{title}</Bold>
}
