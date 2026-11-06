import { describe, expect, it } from 'vitest'

import { splitIntoColumns } from './splitIntoColumns'

describe('splitIntoColumns', () => {
  it('заполняет сначала левую колонку', () => {
    expect(splitIntoColumns([1, 2, 3], 2)).toEqual([[1, 2], [3]])
  })

  it('одна колонка содержит всё', () => {
    expect(splitIntoColumns([1, 2, 3], 1)).toEqual([[1, 2, 3]])
  })

  it('пустой список даёт пустые колонки', () => {
    expect(splitIntoColumns([], 2)).toEqual([[], []])
  })
})
