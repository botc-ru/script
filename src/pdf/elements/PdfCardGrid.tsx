import { StyleSheet, View } from '@react-pdf/renderer'

import { splitIntoRows } from '../../utils/splitIntoRows'
import { mm } from '../units'
import type { PdfCardGridProps } from './PdfCardGridProps'

const styles = StyleSheet.create({
  list: {
    flexDirection: 'column',
  },
  listStretched: {
    flexGrow: 1,
    flexShrink: 0,
  },
  row: {
    flexDirection: 'row',
    gap: mm(4),
  },
  rowStretched: {
    flexGrow: 1,
  },
  cell: {
    flex: 1,
  },
  cellStretched: {
    justifyContent: 'center',
  },
})

/**
 * Карточки PDF в одну или две колонки.
 *
 * Две колонки идут общими строками: левая колонка заполняется первой, а карточки соседних
 * колонок стоят вровень. При `isStretched` каждая строка получает равную долю свободной высоты,
 * а карточки стоят в ней по центру: так отступы между ролями одинаковые.
 */
export function PdfCardGrid({ cards, columns, gap = 2, isStretched = false }: PdfCardGridProps) {
  const listStyle = [styles.list, { gap: mm(gap) }, isStretched ? styles.listStretched : {}]
  if (columns === 1 && !isStretched) return <View style={listStyle}>{cards}</View>

  return (
    <View style={listStyle}>
      {splitIntoRows(cards, columns).map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, isStretched ? styles.rowStretched : {}]}>
          {row.map((card, index) => (
            <View key={index} style={[styles.cell, isStretched ? styles.cellStretched : {}]}>
              {card}
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}
