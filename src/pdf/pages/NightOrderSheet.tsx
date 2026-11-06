import { StyleSheet, View } from '@react-pdf/renderer'

import { NightDetailColumn } from '../elements/NightDetailColumn'
import { mm } from '../units'
import type { NightOrderSheetProps } from './NightOrderSheetProps'
import { SheetPage } from './SheetPage'

const styles = StyleSheet.create({
  page: {
    padding: mm(6),
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
    gap: mm(6),
  },
})

/** Подробный порядок ночи: две колонки с подсказками, вторая перевёрнута. */
export function NightOrderSheet({ title, firstNight, otherNight }: NightOrderSheetProps) {
  return (
    <SheetPage style={styles.page}>
      <View style={styles.columns}>
        <NightDetailColumn title="Первая ночь" entries={firstNight} scriptTitle={title} />
        <NightDetailColumn
          title="Другие ночи"
          entries={otherNight}
          scriptTitle={title}
          isRotated
        />
      </View>
    </SheetPage>
  )
}
