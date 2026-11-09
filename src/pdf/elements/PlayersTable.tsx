import { StyleSheet, View } from '@react-pdf/renderer'

import { TEAM_LABELS } from '../../types/TeamLabels'
import { PLAYERS_COUNT_TABLE } from '../../utils/playersCountTable'
import { PDF_ACCENT_COLOR, PDF_TEAM_COLORS } from '../pdfColors'
import { mm } from '../units'
import { Bold } from './Bold'
import type { PlayersTableProps } from './PlayersTableProps'

const { players, townsfolk, outsider, minion, demon } = PLAYERS_COUNT_TABLE

const ROWS = [
  { team: 'townsfolk', counts: townsfolk },
  { team: 'outsider', counts: outsider },
  { team: 'minion', counts: minion },
  { team: 'demon', counts: demon },
] as const

/** Стили таблицы: отступы и рамка умножены на `scale`, шрифт на `textScale`. */
function createStyles(scale: number, textScale: number) {
  const size = (value: number) => mm(value * scale)
  const borderWidth = 0.75 * scale

  return StyleSheet.create({
    border: {
      padding: size(0.15),
      borderWidth,
      borderColor: PDF_ACCENT_COLOR,
    },
    table: {
      paddingVertical: size(0.75),
      paddingRight: size(2),
      borderWidth,
      borderColor: PDF_ACCENT_COLOR,
    },
    row: {
      flexDirection: 'row',
    },
    label: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      width: size(32),
      paddingVertical: size(1),
      paddingHorizontal: size(0.5),
    },
    cell: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: size(1),
      paddingHorizontal: size(0.3),
    },
    labelText: {
      fontSize: mm(3.2 * textScale),
    },
    cellText: {
      fontSize: mm(5 * textScale),
      transform: 'scaleY(0.8)',
    },
  })
}

/**
 * Таблица состава команд по числу игроков. Занимает всю ширину родителя.
 *
 * Размер шрифта не зависит от настройки масштаба: при крупном таблица не помещается в центральную
 * колонку листа рассказчика. `scale` увеличивает отступы и двойную рамку, а `textScale` шрифт,
 * чтобы в широком месте таблица выросла пропорционально, а не только в ширину.
 */
export function PlayersTable({ scale = 1, textScale = scale }: PlayersTableProps) {
  const styles = createStyles(scale, textScale)

  return (
    <View style={styles.border}>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={styles.label}>
            <Bold style={[styles.labelText, { color: PDF_ACCENT_COLOR }]}>ИГРОКИ</Bold>
          </View>
          {players.map((count, index) => (
            <View key={count} style={styles.cell}>
              <Bold style={[styles.cellText, { color: PDF_ACCENT_COLOR }]}>
                {index === players.length - 1 ? `${count}+` : String(count)}
              </Bold>
            </View>
          ))}
        </View>
        {ROWS.map(({ team, counts }) => (
          <View key={team} style={styles.row}>
            <View style={styles.label}>
              <Bold style={[styles.labelText, { color: PDF_TEAM_COLORS[team] }]}>
                {TEAM_LABELS[team].toUpperCase()}
              </Bold>
            </View>
            {counts.map((count, index) => (
              <View key={players[index]} style={styles.cell}>
                <Bold style={[styles.cellText, { color: PDF_TEAM_COLORS[team] }]}>
                  {String(count)}
                </Bold>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}
