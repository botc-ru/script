import { Image, StyleSheet, View } from '@react-pdf/renderer'
import { use } from 'react'

import { PDF_ACCENT_COLOR, PDF_TEAM_COLORS } from '../pdfColors'
import { PdfSettingsContext } from '../PdfSettingsContext'
import { mm } from '../units'
import { useFontSize } from '../useFontSize'
import { Bold } from './Bold'
import type { NightDetailColumnProps } from './NightDetailColumnProps'
import { NightTitle } from './NightTitle'
import { PdfText } from './PdfText'

const styles = StyleSheet.create({
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  rotated: {
    transform: 'rotate(180deg)',
  },
  heading: {
    alignItems: 'flex-start',
    marginBottom: mm(5),
  },
  headingRotated: {
    alignItems: 'flex-start',
    marginTop: mm(5),
  },
  list: {
    flex: 1,
    flexDirection: 'column',
    gap: mm(3),
  },
  listRotated: {
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  icon: {
    flexShrink: 0,
    width: mm(8),
    height: mm(8),
    objectFit: 'contain',
  },
  text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: mm(5),
  },
  hint: {
    marginTop: mm(0.6),
  },
  footer: {
    alignItems: 'flex-end',
    paddingVertical: mm(2),
  },
})

/**
 * Колонка подробного порядка ночи: заголовок, записи и название сценария внизу.
 * Подсказки к записям показываются при настройке `nightHints`.
 *
 * В перевёрнутой колонке заголовок и строки повёрнуты на 180°.
 */
export function NightDetailColumn({
  title,
  entries,
  scriptTitle,
  isRotated = false,
}: NightDetailColumnProps) {
  const { nightHints } = use(PdfSettingsContext)
  const fontSize = useFontSize()
  const rotation = isRotated ? styles.rotated : {}

  const heading = (
    <View style={[isRotated ? styles.headingRotated : styles.heading, rotation]}>
      <NightTitle title={title} />
    </View>
  )
  const footer = (
    <View style={[styles.footer, isRotated ? {} : styles.rotated]}>
      <Bold style={{ fontSize: fontSize(4) }}>{scriptTitle}</Bold>
    </View>
  )
  const list = (
    <View style={[styles.list, isRotated ? styles.listRotated : {}]}>
      {(isRotated ? entries.toReversed() : entries).map(({ role, hint }) => (
        <View key={role.id} style={[styles.row, rotation]} wrap={false}>
          <Image src={role.image} style={styles.icon} />
          <View style={styles.text}>
            <Bold
              style={{
                fontSize: fontSize(3.5),
                color: role.team ? PDF_TEAM_COLORS[role.team] : PDF_ACCENT_COLOR,
              }}
            >
              {role.name}
            </Bold>
            {nightHints && hint && <PdfText style={styles.hint}>{hint}</PdfText>}
          </View>
        </View>
      ))}
    </View>
  )

  return (
    <View style={styles.column}>
      {isRotated ? footer : heading}
      {list}
      {isRotated ? heading : footer}
    </View>
  )
}
