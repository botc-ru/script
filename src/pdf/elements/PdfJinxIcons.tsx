import { Image, StyleSheet, View } from '@react-pdf/renderer'

import { mm } from '../units'
import type { PdfJinxIconsProps } from './PdfJinxIconsProps'

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    gap: mm(0.5),
    marginLeft: mm(1),
  },
  iconsInline: {
    marginTop: mm(-0.5),
    marginBottom: mm(-0.5),
  },
  icon: {
    flexShrink: 0,
    width: mm(5),
    height: mm(5),
    objectFit: 'contain',
  },
  iconCompact: {
    width: mm(5.5),
    height: mm(5.5),
  },
})

/** Иконки ролей, с которыми у роли есть джинкс. Без таких ролей ничего не показывает. */
export function PdfJinxIcons({ roles, isCompact }: PdfJinxIconsProps) {
  if (roles.length === 0) return null

  return (
    <View style={[styles.icons, isCompact ? {} : styles.iconsInline]}>
      {roles.map((role) => (
        <Image
          key={role.id}
          src={role.image}
          style={[styles.icon, isCompact ? styles.iconCompact : {}]}
        />
      ))}
    </View>
  )
}
