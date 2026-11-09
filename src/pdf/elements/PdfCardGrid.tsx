import { StyleSheet, View } from '@react-pdf/renderer'

import { splitIntoRows } from '../../utils/splitIntoRows'
import { mm } from '../units'
import type { PdfCardGridProps } from './PdfCardGridProps'

const styles = StyleSheet.create({
  list: {
    flexDirection: 'column',
    gap: mm(2),
  },
  row: {
    flexDirection: 'row',
    gap: mm(4),
  },
  cell: {
    flex: 1,
  },
})

/**
 * Карточки листа рассказчика в одну или две колонки.
 *
 * Две колонки идут общими строками, как на листе игрока: левая колонка заполняется первой,
 * а карточки соседних колонок стоят вровень.
 */
export function PdfCardGrid({ cards, columns }: PdfCardGridProps) {
  if (columns === 1) return <View style={styles.list}>{cards}</View>

  return (
    <View style={styles.list}>
      {splitIntoRows(cards, columns).map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((card, index) => <View key={index} style={styles.cell}>{card}</View>)}
        </View>
      ))}
    </View>
  )
}
