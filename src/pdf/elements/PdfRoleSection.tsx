import { StyleSheet, View } from '@react-pdf/renderer'
import { use } from 'react'

import { getJinxPartners } from '../../utils/getJinxPartners'
import { splitIntoColumns } from '../../utils/splitIntoColumns'
import { PdfSettingsContext } from '../PdfSettingsContext'
import { mm } from '../units'
import { PdfRoleCard } from './PdfRoleCard'
import type { PdfRoleSectionProps } from './PdfRoleSectionProps'
import { PdfSectionTitle } from './PdfSectionTitle'

const styles = StyleSheet.create({
  section: {
    flexShrink: 0,
  },
  columns: {
    flexDirection: 'row',
    gap: mm(4),
  },
  columnsStretch: {
    flexGrow: 1,
    flexShrink: 0,
  },
  column: {
    flex: 1,
    flexShrink: 0,
    flexDirection: 'column',
    gap: mm(1.5),
  },
  columnCompact: {
    gap: mm(0.8),
  },
  columnStretch: {
    justifyContent: 'space-evenly',
  },
})

/**
 * Секция листа игрока: заголовок и роли в одну или две колонки. Пустая секция не показывается.
 *
 * При настройке `stretch` секции делят свободную высоту листа пропорционально числу строк.
 */
export function PdfRoleSection({ title, roles, jinxes }: PdfRoleSectionProps) {
  const { columns, stretch } = use(PdfSettingsContext)
  if (roles.length === 0) return null

  const isCompact = columns === 1
  const canStretch = stretch && roles.length > 1
  const rows = Math.ceil(roles.length / columns)

  return (
    <View style={[styles.section, canStretch ? { flexGrow: rows + 1 } : {}]}>
      <PdfSectionTitle title={title} />
      <View style={[styles.columns, canStretch ? styles.columnsStretch : {}]}>
        {splitIntoColumns(roles, columns).map((column, index) => (
          <View
            key={index}
            style={[
              styles.column,
              isCompact ? styles.columnCompact : {},
              canStretch && column.length > 1 ? styles.columnStretch : {},
            ]}
          >
            {column.map((role) => (
              <PdfRoleCard
                key={role.id}
                role={role}
                jinxPartners={getJinxPartners(role, jinxes)}
                isCompact={isCompact}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}
