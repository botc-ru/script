import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { readPdfStyle } from '../../test/readPdfStyle'
import { mm } from '../units'
import { PdfCardGrid } from './PdfCardGrid'

interface MockProps {
  style?: object | object[]
  children?: ReactNode
}

// Стили складываются в атрибут, чтобы найти строки
vi.mock('@react-pdf/renderer', () => ({
  StyleSheet: { create: (styles: unknown) => styles },
  View: ({ style, children }: MockProps) => (
    <div data-style={JSON.stringify(Object.assign({}, ...[style].flat()))}>{children}</div>
  ),
}))

const CARDS = ['a', 'b', 'c'].map((id) => <i key={id}>{id}</i>)

function readRows(container: HTMLElement) {
  return [...container.querySelectorAll('[data-style]')]
    .filter((view) => readPdfStyle(view).flexDirection === 'row')
    .map((row) => row.textContent)
}

describe('PdfCardGrid', () => {
  it('в одну колонку ставит карточки друг под другом', () => {
    const { container } = render(<PdfCardGrid cards={CARDS} columns={1} />)

    expect(readRows(container)).toEqual([])
    expect(container.textContent).toBe('abc')
  })

  it('в две колонки заполняет сначала левую, строки вровень', () => {
    const { container } = render(<PdfCardGrid cards={CARDS} columns={2} />)

    // Левая колонка: a, b. Правая: c
    expect(readRows(container)).toEqual(['ac', 'b'])
  })

  it('при isStretched и в одну колонку идёт строками, которые делят высоту', () => {
    const { container } = render(<PdfCardGrid cards={CARDS} columns={1} isStretched />)
    const rows = [...container.querySelectorAll('[data-style]')]
      .filter((view) => readPdfStyle(view).flexDirection === 'row')

    expect(rows.map((row) => row.textContent)).toEqual(['a', 'b', 'c'])
    expect(rows.every((row) => readPdfStyle(row).flexGrow === 1)).toBe(true)
  })

  it('расстояние между карточками задаётся в мм', () => {
    const { container } = render(<PdfCardGrid cards={CARDS} columns={1} gap={1.5} />)

    expect(readPdfStyle(container.firstElementChild).gap).toBeCloseTo(mm(1.5))
  })
})
