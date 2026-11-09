import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { use } from 'react'

import type { Team } from '../../types/Team'
import { TEAM_LABELS } from '../../types/TeamLabels'
import { NightColumn } from '../elements/NightColumn'
import { PdfCardGrid } from '../elements/PdfCardGrid'
import { PdfJinxRow } from '../elements/PdfJinxRow'
import { PdfRoleCard } from '../elements/PdfRoleCard'
import { PdfRoleList } from '../elements/PdfRoleList'
import { PlayersTable } from '../elements/PlayersTable'
import { ScriptTitle } from '../elements/ScriptTitle'
import { PdfSettingsContext } from '../PdfSettingsContext'
import { mm } from '../units'
import { useFontSize } from '../useFontSize'
import { SheetPage } from './SheetPage'
import type { StorytellerSheetProps } from './StorytellerSheetProps'

/** Поля листа, мм. */
const PAGE_PADDING = 6

/** Отступ таблицы игроков от краёв листа без колонок ночи, мм. */
const WIDE_TABLE_INSET = 10

/**
 * Во сколько раз таблица игроков без колонок ночи шире, чем в центре между ними (114 мм).
 * Во столько же раз растут её шрифт и отступы.
 */
const WIDE_TABLE_SCALE = (210 - 2 * WIDE_TABLE_INSET) / 114

const styles = StyleSheet.create({
  page: {
    padding: mm(PAGE_PADDING),
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
    gap: mm(4),
  },
  center: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    alignItems: 'center',
    marginBottom: mm(2),
  },
  author: {
    marginBottom: mm(2),
    opacity: 0.7,
    textAlign: 'center',
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    gap: mm(4),
  },
  wideTable: {
    marginHorizontal: mm(WIDE_TABLE_INSET - PAGE_PADDING),
  },
})

/**
 * Лист рассказчика. По бокам порядок ночи, вторая колонка перевёрнута. В центре название,
 * Летописцы, Джинн с джинксами, Сказочники, Странники и таблица игроков.
 *
 * Без колонок ночи центр занимает всю ширину листа, а таблица игроков растёт пропорционально
 * и стоит в 10 мм от краёв листа.
 * Роли и джинксы идут в одну или две колонки (настройка `storytellerColumns`).
 */
export function StorytellerSheet({
  title,
  color,
  author,
  sections,
  jinxes,
  firstNight,
  otherNight,
}: StorytellerSheetProps) {
  const { travellers, playersTable, nightOrderColumns, storytellerColumns } =
    use(PdfSettingsContext)
  const fontSize = useFontSize()

  function getSection(team: Team) {
    return sections.find((section) => section.team === team)
  }

  const fabled = getSection('fabled')

  return (
    <SheetPage style={styles.page}>
      <View style={styles.columns}>
        {nightOrderColumns && <NightColumn title="Первая ночь" entries={firstNight} />}

        <View style={styles.center}>
          <View style={styles.title}>
            <ScriptTitle title={title} color={color} />
          </View>
          {author && <Text style={[styles.author, { fontSize: fontSize(4.5) }]}>{author}</Text>}

          <View style={styles.body}>
            <PdfRoleList
              title={TEAM_LABELS.loric}
              roles={getSection('loric')?.roles ?? []}
              jinxes={jinxes}
            />
            {fabled && (
              <PdfCardGrid
                columns={storytellerColumns}
                cards={[
                  ...fabled.pinnedRoles.map((role) => (
                    <PdfRoleCard key={role.id} role={role} isColored={false} />
                  )),
                  ...jinxes.map((jinx) => (
                    <PdfJinxRow key={`${jinx.roleA.id}-${jinx.roleB.id}`} jinx={jinx} />
                  )),
                  ...fabled.roles.map((role) => (
                    <PdfRoleCard key={role.id} role={role} isColored={false} />
                  )),
                ]}
              />
            )}
            {travellers && (
              <PdfRoleList
                title={TEAM_LABELS.traveller}
                roles={getSection('traveller')?.roles ?? []}
                jinxes={jinxes}
              />
            )}
          </View>

          {playersTable && nightOrderColumns && <PlayersTable />}
          {playersTable && !nightOrderColumns && (
            <View style={styles.wideTable}>
              <PlayersTable scale={WIDE_TABLE_SCALE} />
            </View>
          )}
        </View>

        {nightOrderColumns && <NightColumn title="Другие ночи" entries={otherNight} isRotated />}
      </View>
    </SheetPage>
  )
}
