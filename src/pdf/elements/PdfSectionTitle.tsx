import { StyleSheet, View } from '@react-pdf/renderer'

import { mm } from '../units'
import { useFontSize } from '../useFontSize'
import { Bold } from './Bold'
import type { PdfSectionTitleProps } from './PdfSectionTitleProps'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: mm(-1),
    marginBottom: mm(2),
  },
  title: {
    textTransform: 'uppercase',
  },
  line: {
    flex: 1,
    height: 0.8,
    marginLeft: mm(2),
    backgroundColor: '#000',
  },
})

/**
 * Заголовок секции в PDF: название и горизонтальная линия справа.
 * Выступает на 1 мм за поля листа с обеих сторон: иконки ролей под ним стоят чуть правее.
 */
export function PdfSectionTitle({ title, style = {} }: PdfSectionTitleProps) {
  const fontSize = useFontSize()

  return (
    <View style={[styles.row, style]}>
      <Bold style={[styles.title, { fontSize: fontSize(3.5) }]}>{title}</Bold>
      <View style={styles.line} />
    </View>
  )
}
