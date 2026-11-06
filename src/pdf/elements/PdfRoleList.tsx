import { StyleSheet, View } from '@react-pdf/renderer'

import { getJinxPartners } from '../../utils/getJinxPartners'
import { mm } from '../units'
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
  list: {
    flexDirection: 'column',
    gap: mm(2),
  },
})

/** Команда на листе рассказчика: заголовок и роли в одну колонку. Без ролей не показывается. */
export function PdfRoleList({ title, roles, jinxes }: PdfRoleListProps) {
  if (roles.length === 0) return null

  return (
    <View style={styles.section}>
      <PdfSectionTitle title={title} style={styles.title} />
      <View style={styles.list}>
        {roles.map((role) => (
          <PdfRoleCard key={role.id} role={role} jinxPartners={getJinxPartners(role, jinxes)} />
        ))}
      </View>
    </View>
  )
}
