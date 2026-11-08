import { StyleSheet, Text } from '@react-pdf/renderer'

import { PDF_TEXT_COLOR } from '../pdfColors'
import { useFontSize } from '../useFontSize'
import type { PdfTextProps } from './PdfTextProps'

const styles = StyleSheet.create({
  text: {
    color: PDF_TEXT_COLOR,
    fontFamily: 'Roboto-Condensed',
    fontWeight: 300,
  },
  modifications: {
    fontWeight: 700,
  },
})

/**
 * Основной текст PDF: способности, джинксы и подсказки порядка ночи.
 * Добавка к составу (`modifications`) выводится жирным в квадратных скобках после текста.
 */
export function PdfText({ modifications, style = {}, children }: PdfTextProps) {
  const fontSize = useFontSize()

  return (
    <Text style={[styles.text, { fontSize: fontSize(3.5) }, style]}>
      {children}
      {modifications && <Text style={styles.modifications}>{` [${modifications}]`}</Text>}
    </Text>
  )
}
