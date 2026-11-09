import { StyleSheet, View } from '@react-pdf/renderer'
import { use } from 'react'

import { getJinxPartners } from '../../utils/getJinxPartners'
import { PdfSettingsContext } from '../PdfSettingsContext'
import { mm } from '../units'
import { PdfCardGrid } from './PdfCardGrid'
import { PdfRoleCard } from './PdfRoleCard'
import type { PdfRoleListProps } from './PdfRoleListProps'
import { PdfSectionTitle } from './PdfSectionTitle'

const styles = StyleSheet.create({
  section: {
    flexShrink: 0,
  },
  title: {
    marginTop: mm(2),
    marginBottom: mm(5),
  },
})

/**
 * Команда на листе рассказчика: заголовок и роли в одну или две колонки
 * (настройка `storytellerColumns`). Без ролей не показывается.
 */
export function PdfRoleList({ title, roles, jinxes }: PdfRoleListProps) {
  const { storytellerColumns } = use(PdfSettingsContext)
  if (roles.length === 0) return null

  return (
    <View style={styles.section}>
      <PdfSectionTitle title={title} style={styles.title} />
      <PdfCardGrid
        columns={storytellerColumns}
        cards={roles.map((role) => (
          <PdfRoleCard key={role.id} role={role} jinxPartners={getJinxPartners(role, jinxes)} />
        ))}
      />
    </View>
  )
}
