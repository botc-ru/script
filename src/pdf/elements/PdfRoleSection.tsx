import { StyleSheet, View } from '@react-pdf/renderer'

import { getJinxPartners } from '../../utils/getJinxPartners'
import { PdfCardGrid } from './PdfCardGrid'
import { PdfRoleCard } from './PdfRoleCard'
import type { PdfRoleSectionProps } from './PdfRoleSectionProps'
import { PdfSectionTitle } from './PdfSectionTitle'

const styles = StyleSheet.create({
  section: {
    flexShrink: 0,
  },
})

/**
 * Команда в PDF: заголовок и роли в одну или две колонки. Пустая секция не показывается.
 * Общая для листа игрока и листа рассказчика: раскладку задаёт лист.
 *
 * При `isStretched` секция забирает долю свободной высоты листа по числу своих строк,
 * а строки делят её поровну. Одну роль растягивать незачем.
 */
export function PdfRoleSection({
  title,
  roles,
  jinxes,
  columns,
  gap,
  isStretched = false,
  isCompact = false,
  titleStyle,
}: PdfRoleSectionProps) {
  if (roles.length === 0) return null

  const canStretch = isStretched && roles.length > 1
  const rows = Math.ceil(roles.length / columns)

  return (
    <View style={[styles.section, canStretch ? { flexGrow: rows } : {}]}>
      <PdfSectionTitle title={title} style={titleStyle} />
      <PdfCardGrid
        columns={columns}
        gap={gap}
        isStretched={canStretch}
        cards={roles.map((role) => (
          <PdfRoleCard
            key={role.id}
            role={role}
            jinxPartners={getJinxPartners(role, jinxes)}
            isCompact={isCompact}
          />
        ))}
      />
    </View>
  )
}
