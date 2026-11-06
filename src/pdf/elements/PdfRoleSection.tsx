import { StyleSheet, View } from '@react-pdf/renderer'
import { use } from 'react'

import type { Role } from '../../types/Role'
import { getJinxPartners } from '../../utils/getJinxPartners'
import { splitIntoColumns } from '../../utils/splitIntoColumns'
import { splitIntoRows } from '../../utils/splitIntoRows'
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
  column: {
    flex: 1,
    flexShrink: 0,
    flexDirection: 'column',
    gap: mm(1.5),
  },
  columnCompact: {
    gap: mm(0.8),
  },
  rows: {
    flexGrow: 1,
    flexShrink: 0,
    flexDirection: 'column',
    gap: mm(1.5),
  },
  rowsEven: {
    justifyContent: 'space-evenly',
  },
})

/**
 * Секция листа игрока: заголовок и роли в одну или две колонки. Пустая секция не показывается.
 *
 * При настройке `stretch` секции делят свободную высоту листа пропорционально числу строк,
 * а роли идут общими строками: при нечётном числе ролей колонки всё равно начинаются вровень.
 */
export function PdfRoleSection({ title, roles, jinxes }: PdfRoleSectionProps) {
  const { columns, stretch } = use(PdfSettingsContext)
  if (roles.length === 0) return null

  const isCompact = columns === 1
  const canStretch = stretch && roles.length > 1
  const rows = Math.ceil(roles.length / columns)

  function renderCard(role: Role) {
    return (
      <PdfRoleCard
        key={role.id}
        role={role}
        jinxPartners={getJinxPartners(role, jinxes)}
        isCompact={isCompact}
      />
    )
  }

  const gap = isCompact ? styles.columnCompact : {}

  return (
    <View style={[styles.section, canStretch ? { flexGrow: rows + 1 } : {}]}>
      <PdfSectionTitle title={title} />
      {canStretch
        ? (
            <View style={[styles.rows, gap, rows > 1 ? styles.rowsEven : {}]}>
              {splitIntoRows(roles, columns).map((row, rowIndex) => (
                <View key={rowIndex} style={styles.columns}>
                  {row.map((role, index) => (
                    <View key={index} style={styles.column}>{role && renderCard(role)}</View>
                  ))}
                </View>
              ))}
            </View>
          )
        : (
            <View style={styles.columns}>
              {splitIntoColumns(roles, columns).map((column, index) => (
                <View key={index} style={[styles.column, gap]}>{column.map(renderCard)}</View>
              ))}
            </View>
          )}
    </View>
  )
}
