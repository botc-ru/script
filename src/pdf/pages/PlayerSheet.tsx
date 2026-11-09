import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import { use } from 'react'

import logoImage from '../../assets/images/logo.png'
import { TEAM_LABELS } from '../../types/TeamLabels'
import { REQUIRED_TEAMS } from '../../types/TeamOrder'
import { Bold } from '../elements/Bold'
import { PdfRoleSection } from '../elements/PdfRoleSection'
import { PdfSettingsContext } from '../PdfSettingsContext'
import { mm } from '../units'
import { useFontSize } from '../useFontSize'
import type { PlayerSheetProps } from './PlayerSheetProps'
import { SheetPage } from './SheetPage'

const styles = StyleSheet.create({
  watermark: {
    position: 'absolute',
    top: mm(50),
    left: mm(-20),
    width: mm(250),
    opacity: 0.1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
  },
  author: {
    maxWidth: mm(60),
    marginBottom: mm(5),
    marginLeft: mm(4),
    opacity: 0.7,
    textAlign: 'right',
  },
  notFirstNight: {
    marginBottom: mm(-1),
    fontFamily: 'Roboto-Condensed',
    fontWeight: 300,
    textAlign: 'right',
  },
  sections: {
    flex: 1,
    flexDirection: 'column',
    gap: mm(2.5),
  },
})

/**
 * Лист игрока: название, автор и основные команды.
 * В одну колонку роли идут компактно, в строку; секции растягиваются при настройке `stretch`.
 */
export function PlayerSheet({ title, script, sections, jinxes }: PlayerSheetProps) {
  const { logo, columns, stretch } = use(PdfSettingsContext)
  const fontSize = useFontSize()
  const isCompact = columns === 1

  return (
    <SheetPage>
      {logo && <Image src={logoImage} style={styles.watermark} />}
      <View style={styles.header}>
        <View style={styles.title}>
          <Bold style={{ fontSize: fontSize(8.47), color: script.color }}>{title}</Bold>
        </View>
        {script.author && (
          <Text style={[styles.author, { fontSize: fontSize(3.5) }]}>{script.author}</Text>
        )}
      </View>
      <Text style={[styles.notFirstNight, { fontSize: fontSize(3.2) }]}>* Не в первую ночь</Text>

      <View style={styles.sections}>
        {sections
          .filter((section) => REQUIRED_TEAMS.includes(section.team))
          .map((section) => (
            <PdfRoleSection
              key={section.team}
              title={TEAM_LABELS[section.team]}
              roles={section.roles}
              jinxes={jinxes}
              columns={columns}
              gap={isCompact ? 0.8 : 1.5}
              isStretched={stretch}
              isCompact={isCompact}
            />
          ))}
      </View>
    </SheetPage>
  )
}
