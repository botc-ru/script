import { Image, StyleSheet, View } from '@react-pdf/renderer'

import { PDF_TEAM_COLORS, PDF_TEXT_COLOR } from '../pdfColors'
import { mm } from '../units'
import { useFontSize } from '../useFontSize'
import { Bold } from './Bold'
import type { PdfRoleCardProps } from './PdfRoleCardProps'
import { PdfText } from './PdfText'

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  icon: {
    width: mm(14.4),
    height: mm(14.4),
    objectFit: 'contain',
  },
  iconCompact: {
    width: mm(8),
    height: mm(8),
    objectFit: 'contain',
  },
  text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: mm(5),
  },
  ability: {
    marginTop: mm(0.6),
  },
  abilityCompact: {
    flex: 1,
    marginLeft: mm(1),
  },
  name: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: mm(26),
    marginLeft: mm(1),
  },
  jinxes: {
    flexDirection: 'row',
    gap: mm(0.5),
    marginTop: mm(-0.5),
    marginBottom: mm(-0.5),
    marginLeft: mm(1),
  },
  jinxesCompact: {
    flexDirection: 'row',
    gap: mm(0.5),
    marginLeft: mm(1),
  },
  jinx: {
    width: mm(5),
    height: mm(5),
    flexShrink: 0,
    objectFit: 'contain',
  },
  jinxCompact: {
    width: mm(5.5),
    height: mm(5.5),
    flexShrink: 0,
    objectFit: 'contain',
  },
})

/**
 * Роль в PDF: иконка, имя в цвете команды, иконки джинксов и способность с модификациями.
 *
 * Обычная карточка показывает способность под именем. При `isCompact` всё идёт в одну строку.
 */
export function PdfRoleCard({
  role,
  jinxPartners = [],
  isCompact = false,
  isColored = true,
}: PdfRoleCardProps) {
  const fontSize = useFontSize()
  const color = isColored && role.team ? PDF_TEAM_COLORS[role.team] : PDF_TEXT_COLOR
  const name = <Bold style={{ fontSize: fontSize(3.5), color }}>{role.name}</Bold>
  const jinxes = jinxPartners.length > 0 && (
    <View style={isCompact ? styles.jinxesCompact : styles.jinxes}>
      {jinxPartners.map((partner) => (
        <Image
          key={partner.id}
          src={partner.image}
          style={isCompact ? styles.jinxCompact : styles.jinx}
        />
      ))}
    </View>
  )

  if (isCompact) {
    return (
      <View style={styles.card} wrap={false}>
        <Image src={role.image} style={styles.iconCompact} />
        <View style={styles.nameCompact}>
          {name}
          {jinxes}
        </View>
        <PdfText modifications={role.modifications} style={styles.abilityCompact}>
          {role.ability}
        </PdfText>
      </View>
    )
  }

  return (
    <View style={styles.card} wrap={false}>
      <Image src={role.image} style={styles.icon} />
      <View style={styles.text}>
        <View style={styles.name}>
          {name}
          {jinxes}
        </View>
        <PdfText modifications={role.modifications} style={styles.ability}>
          {role.ability}
        </PdfText>
      </View>
    </View>
  )
}
