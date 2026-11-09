import { StyleSheet, View } from '@react-pdf/renderer'

import { PdfCardGrid } from './PdfCardGrid'
import { PdfJinxRow } from './PdfJinxRow'
import type { PdfJinxSectionProps } from './PdfJinxSectionProps'
import { PdfSectionTitle } from './PdfSectionTitle'

const styles = StyleSheet.create({
  section: {
    flexShrink: 0,
  },
})

/**
 * Секция «Правила Джинна» в PDF: заголовок и джинксы в одну или две колонки, как на сайте.
 * Без джинксов не показывается.
 */
export function PdfJinxSection({ jinxes, columns, titleStyle }: PdfJinxSectionProps) {
  if (jinxes.length === 0) return null

  return (
    <View style={styles.section}>
      <PdfSectionTitle title="Правила Джинна" style={titleStyle} />
      <PdfCardGrid
        columns={columns}
        cards={jinxes.map((jinx) => (
          <PdfJinxRow key={`${jinx.roleA.id}-${jinx.roleB.id}`} jinx={jinx} />
        ))}
      />
    </View>
  )
}
