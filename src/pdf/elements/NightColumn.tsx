import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'

import { PDF_ACCENT_COLOR, PDF_TEXT_COLOR } from '../pdfColors'
import { mm } from '../units'
import { useFontSize } from '../useFontSize'
import { Bold } from './Bold'
import type { NightColumnProps } from './NightColumnProps'

const styles = StyleSheet.create({
  column: {
    flexShrink: 0,
    flexDirection: 'column',
    gap: mm(3.5),
    width: mm(38),
    paddingRight: mm(6),
    borderRightWidth: 0.75,
    borderRightColor: '#ccc',
  },
  columnRotated: {
    justifyContent: 'flex-end',
    paddingRight: 0,
    paddingLeft: mm(6),
    borderRightWidth: 0,
    borderLeftWidth: 0.75,
    borderLeftColor: '#ccc',
  },
  rotated: {
    transform: 'rotate(180deg)',
  },
  title: {
    width: mm(32),
    color: PDF_ACCENT_COLOR,
    textTransform: 'uppercase',
  },
  list: {
    flexDirection: 'column',
    gap: mm(3.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: mm(1.5),
    width: mm(32),
  },
  icon: {
    flexShrink: 0,
    width: mm(8),
    height: mm(8),
    objectFit: 'contain',
  },
  name: {
    flex: 1,
    color: PDF_TEXT_COLOR,
    fontFamily: 'Roboto-Condensed',
    fontWeight: 700,
  },
})

/**
 * Узкая колонка порядка ночи на листе рассказчика: заголовок и список с иконками.
 *
 * Перевёрнутая колонка стоит справа, а её заголовок и строки повёрнуты на 180°.
 */
export function NightColumn({ title, entries, isRotated = false }: NightColumnProps) {
  const fontSize = useFontSize()
  const rotation = isRotated ? styles.rotated : {}

  const titleElement = (
    <View style={rotation}>
      <Bold style={[styles.title, { fontSize: fontSize(3.5) }]}>{title}</Bold>
    </View>
  )
  const listElement = (
    <View style={styles.list}>
      {(isRotated ? entries.toReversed() : entries).map(({ role }) => (
        <View key={role.id} style={[styles.row, rotation]} wrap={false}>
          <Image src={role.image} style={styles.icon} />
          <Text style={[styles.name, { fontSize: fontSize(3.5) }]}>{role.name}</Text>
        </View>
      ))}
    </View>
  )

  return (
    <View style={[styles.column, isRotated ? styles.columnRotated : {}]}>
      {isRotated ? listElement : titleElement}
      {isRotated ? titleElement : listElement}
    </View>
  )
}
