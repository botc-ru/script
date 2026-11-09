import { Image, Page, StyleSheet, View } from '@react-pdf/renderer'
import { use } from 'react'

import paperImage from '../../assets/images/paper.jpg'
import { A4_SIZE } from '../a4Size'
import { PdfSettingsContext } from '../PdfSettingsContext'
import { mm } from '../units'
import { SHEET_PADDING } from './sheetPadding'
import type { SheetPageProps } from './SheetPageProps'

const styles = StyleSheet.create({
  page: {
    position: 'relative',
    fontFamily: 'Petersburg',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: mm(A4_SIZE.width),
    height: mm(A4_SIZE.height),
    objectFit: 'cover',
  },
  content: {
    position: 'relative',
    flex: 1,
    paddingTop: mm(SHEET_PADDING.top),
    paddingHorizontal: mm(SHEET_PADDING.x),
    paddingBottom: mm(SHEET_PADDING.bottom),
  },
})

/** Страница A4 с бумажным фоном, если он включён, и отступами. */
export function SheetPage({ style = {}, children }: SheetPageProps) {
  const { background } = use(PdfSettingsContext)

  return (
    <Page size="A4" style={styles.page}>
      {background && <Image src={paperImage} style={styles.background} />}
      <View style={[styles.content, ...[style].flat()]}>{children}</View>
    </Page>
  )
}
