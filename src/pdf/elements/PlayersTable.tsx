import { StyleSheet, View } from '@react-pdf/renderer'

import { TEAM_LABELS } from '../../types/TeamLabels'
import { PLAYERS_COUNT_TABLE } from '../../utils/playersCountTable'
import { PDF_ACCENT_COLOR, PDF_TEAM_COLORS } from '../pdfColors'
import { mm } from '../units'
import { Bold } from './Bold'

const { players, townsfolk, outsider, minion, demon } = PLAYERS_COUNT_TABLE

const ROWS = [
  { team: 'townsfolk', counts: townsfolk },
  { team: 'outsider', counts: outsider },
  { team: 'minion', counts: minion },
  { team: 'demon', counts: demon },
] as const

const styles = StyleSheet.create({
  border: {
    padding: mm(0.15),
    borderWidth: 0.75,
    borderColor: PDF_ACCENT_COLOR,
  },
  table: {
    paddingVertical: mm(0.75),
    paddingRight: mm(2),
    borderWidth: 0.75,
    borderColor: PDF_ACCENT_COLOR,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: mm(32),
    paddingVertical: mm(1),
    paddingHorizontal: mm(0.5),
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: mm(1),
    paddingHorizontal: mm(0.3),
  },
})

const labelStyle = { fontSize: mm(3.2) }
const cellStyle = { fontSize: mm(5), transform: 'scaleY(0.8)' }

/**
 * Таблица состава команд по числу игроков.
 *
 * Размер шрифта не зависит от настройки масштаба: при крупном таблица не помещается в центральную
 * колонку листа рассказчика.
 */
export function PlayersTable() {
  return (
    <View style={styles.border}>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={styles.label}>
            <Bold style={{ ...labelStyle, color: PDF_ACCENT_COLOR }}>ИГРОКИ</Bold>
          </View>
          {players.map((count, index) => (
            <View key={count} style={styles.cell}>
              <Bold style={{ ...cellStyle, color: PDF_ACCENT_COLOR }}>
                {index === players.length - 1 ? `${count}+` : String(count)}
              </Bold>
            </View>
          ))}
        </View>
        {ROWS.map(({ team, counts }) => (
          <View key={team} style={styles.row}>
            <View style={styles.label}>
              <Bold style={{ ...labelStyle, color: PDF_TEAM_COLORS[team] }}>
                {TEAM_LABELS[team].toUpperCase()}
              </Bold>
            </View>
            {counts.map((count, index) => (
              <View key={players[index]} style={styles.cell}>
                <Bold style={{ ...cellStyle, color: PDF_TEAM_COLORS[team] }}>{String(count)}</Bold>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}
