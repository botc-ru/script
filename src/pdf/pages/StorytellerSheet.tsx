import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { use } from 'react'

import type { Team } from '../../types/Team'
import { TEAM_LABELS } from '../../types/TeamLabels'
import { A4_SIZE } from '../a4Size'
import { NightColumn } from '../elements/NightColumn'
import { NIGHT_COLUMN_WIDTH } from '../elements/nightColumnWidth'
import { PdfCardGrid } from '../elements/PdfCardGrid'
import { PdfJinxRow } from '../elements/PdfJinxRow'
import { PdfRoleCard } from '../elements/PdfRoleCard'
import { PdfRoleSection } from '../elements/PdfRoleSection'
import { PlayersTable } from '../elements/PlayersTable'
import { ScriptTitle } from '../elements/ScriptTitle'
import { PdfSettingsContext } from '../PdfSettingsContext'
import { mm } from '../units'
import { useFontSize } from '../useFontSize'
import { SHEET_PADDING } from './sheetPadding'
import { SheetPage } from './SheetPage'
import type { StorytellerSheetProps } from './StorytellerSheetProps'

/** Верхнее поле листа, мм. Нижнее как у листа игрока: `SHEET_PADDING`. */
const PAGE_PADDING_TOP = 6

/**
 * Боковые поля с колонками ночи, мм: уже, чем у листа игрока, чтобы центру хватило места.
 * Без колонок ночи боковые поля как у листа игрока.
 */
const NIGHT_COLUMNS_PADDING_X = 6

/** Расстояние между колонками ночи и центром, мм. */
const COLUMN_GAP = 4

/** Ширина центра между колонками ночи, мм. */
const CENTER_WIDTH = A4_SIZE.width - 2 * (NIGHT_COLUMNS_PADDING_X + NIGHT_COLUMN_WIDTH + COLUMN_GAP)

/** Отступ таблицы игроков от боковых и нижнего краёв листа без колонок ночи, мм. */
const WIDE_TABLE_INSET = 20

/**
 * Во сколько раз таблица игроков без колонок ночи шире, чем в центре между ними.
 * Во столько же раз растут её отступы и рамка.
 */
const WIDE_TABLE_SCALE = (A4_SIZE.width - 2 * WIDE_TABLE_INSET) / CENTER_WIDTH

/** Шрифт широкой таблицы растёт чуть меньше: при полном росте цифры выглядят тесно. */
const WIDE_TABLE_TEXT_SCALE = WIDE_TABLE_SCALE * 0.9

const styles = StyleSheet.create({
  page: {
    paddingTop: mm(PAGE_PADDING_TOP),
  },
  pageWithNightColumns: {
    paddingHorizontal: mm(NIGHT_COLUMNS_PADDING_X),
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
    gap: mm(COLUMN_GAP),
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
  sectionTitle: {
    marginTop: mm(2),
    marginBottom: mm(5),
  },
  wideTable: {
    marginHorizontal: mm(WIDE_TABLE_INSET - SHEET_PADDING.x),
    marginBottom: mm(WIDE_TABLE_INSET - SHEET_PADDING.bottom),
  },
})

/**
 * Лист рассказчика. По бокам порядок ночи, вторая колонка перевёрнута. В центре название,
 * Летописцы, Джинн с джинксами, Сказочники, Странники и таблица игроков.
 *
 * С колонками ночи боковые поля уже, чем у листа игрока. Без них поля как у листа игрока,
 * центр занимает всю ширину, а таблица игроков растёт пропорционально
 * и стоит в 20 мм от боковых и нижнего краёв листа.
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
    <SheetPage style={[styles.page, nightOrderColumns ? styles.pageWithNightColumns : {}]}>
      <View style={styles.columns}>
        {nightOrderColumns && <NightColumn title="Первая ночь" entries={firstNight} />}

        <View style={styles.center}>
          <View style={styles.title}>
            <ScriptTitle title={title} color={color} />
          </View>
          {author && <Text style={[styles.author, { fontSize: fontSize(4.5) }]}>{author}</Text>}

          <View style={styles.body}>
            <PdfRoleSection
              title={TEAM_LABELS.loric}
              roles={getSection('loric')?.roles ?? []}
              jinxes={jinxes}
              columns={storytellerColumns}
              titleStyle={styles.sectionTitle}
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
              <PdfRoleSection
                title={TEAM_LABELS.traveller}
                roles={getSection('traveller')?.roles ?? []}
                jinxes={jinxes}
                columns={storytellerColumns}
                titleStyle={styles.sectionTitle}
              />
            )}
          </View>

          {playersTable && nightOrderColumns && <PlayersTable />}
          {playersTable && !nightOrderColumns && (
            <View style={styles.wideTable}>
              <PlayersTable scale={WIDE_TABLE_SCALE} textScale={WIDE_TABLE_TEXT_SCALE} />
            </View>
          )}
        </View>

        {nightOrderColumns && <NightColumn title="Другие ночи" entries={otherNight} isRotated />}
      </View>
    </SheetPage>
  )
}
