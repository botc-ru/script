import { describe, expect, it } from 'vitest'

import { PLAYERS_COUNT_TABLE } from './playersCountTable'

describe('PLAYERS_COUNT_TABLE', () => {
  it('сумма команд равна числу игроков', () => {
    const { players, townsfolk, outsider, minion, demon } = PLAYERS_COUNT_TABLE

    const totals = players.map((_, index) => (
      [townsfolk, outsider, minion, demon].reduce((sum, team) => sum + (team[index] ?? 0), 0)
    ))

    expect(totals).toEqual(players)
  })
})
