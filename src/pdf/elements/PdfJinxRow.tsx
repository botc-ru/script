import { Image, StyleSheet, View } from '@react-pdf/renderer'

import { mm } from '../units'
import type { PdfJinxRowProps } from './PdfJinxRowProps'
import { PdfText } from './PdfText'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  icons: {
    flexDirection: 'row',
    gap: mm(1),
  },
  icon: {
    width: mm(10.8),
    height: mm(10.8),
    objectFit: 'contain',
  },
  text: {
    flex: 1,
    marginLeft: mm(5),
  },
})

/** Джинкс в PDF: иконки двух ролей и текст правила. */
export function PdfJinxRow({ jinx }: PdfJinxRowProps) {
  return (
    <View style={styles.row} wrap={false}>
      <View style={styles.icons}>
        <Image src={jinx.roleA.image} style={styles.icon} />
        <Image src={jinx.roleB.image} style={styles.icon} />
      </View>
      <View style={styles.text}>
        <PdfText>{jinx.reason}</PdfText>
      </View>
    </View>
  )
}
