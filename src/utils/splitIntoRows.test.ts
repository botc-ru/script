import { describe, expect, it } from 'vitest'

import { splitIntoRows } from './splitIntoRows'

describe('splitIntoRows', () => {
  it('ставит рядом роли из разных колонок', () => {
    expect(splitIntoRows(['a', 'b', 'c', 'd'], 2)).toEqual([['a', 'c'], ['b', 'd']])
  })

  it('оставляет пустую ячейку в короткой колонке', () => {
    expect(splitIntoRows(['a', 'b', 'c', 'd', 'e'], 2))
      .toEqual([['a', 'd'], ['b', 'e'], ['c', undefined]])
  })

  it('в одну колонку даёт строку на каждый элемент', () => {
    expect(splitIntoRows(['a', 'b'], 1)).toEqual([['a'], ['b']])
  })

  it('без элементов строк нет', () => {
    expect(splitIntoRows([], 2)).toEqual([])
  })
})
