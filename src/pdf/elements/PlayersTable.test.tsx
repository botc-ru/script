import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { readPdfStyle } from '../../test/readPdfStyle'
import type { FontScale } from '../../types/FontScale'
import { DEFAULT_PRINT_SETTINGS } from '../../utils/defaultPrintSettings'
import { PdfSettingsContext } from '../PdfSettingsContext'
import { PlayersTable } from './PlayersTable'

interface MockProps {
  style?: object | object[]
  children?: ReactNode
}

// Стили складываются в атрибут, чтобы проверить размеры
vi.mock('@react-pdf/renderer', () => ({
  StyleSheet: { create: (styles: unknown) => styles },
  View: ({ style, children }: MockProps) => (
    <div data-style={JSON.stringify(Object.assign({}, ...[style].flat()))}>{children}</div>
  ),
  Text: ({ style, children }: MockProps) => (
    <span data-style={JSON.stringify(Object.assign({}, ...[style].flat()))}>{children}</span>
  ),
}))

function renderTable(fontScale: FontScale) {
  const { unmount } = render(
    <PdfSettingsContext value={{ ...DEFAULT_PRINT_SETTINGS, fontScale }}>
      <PlayersTable />
    </PdfSettingsContext>,
  )
  const sizes = ['ПРИСПЕШНИКИ', '15+'].map((text) => readPdfStyle(screen.getByText(text)).fontSize)
  unmount()
  return sizes
}

describe('PlayersTable', () => {
  it('не меняет размер шрифта вместе с настройкой масштаба', () => {
    const medium = renderTable(1)

    expect(renderTable(0.85)).toEqual(medium)
    expect(renderTable(1.15)).toEqual(medium)
  })

  it('scale увеличивает отступы и рамку, textScale шрифт', () => {
    const readSizes = () => {
      const label = screen.getByText('ИГРОКИ')
      const cell = label.parentElement?.nextElementSibling ?? null
      const border = label.closest('[data-style*="borderWidth"]')
      return [
        readPdfStyle(label).fontSize,
        readPdfStyle(cell).paddingVertical,
        readPdfStyle(border).borderWidth,
      ].map(Number)
    }
    const { rerender } = render(<PlayersTable />)
    const [font = 0, padding = 0, border = 0] = readSizes()
    rerender(<PlayersTable scale={2} textScale={1.5} />)

    const [scaledFont, scaledPadding, scaledBorder] = readSizes()

    expect(scaledFont).toBeCloseTo(font * 1.5)
    expect(scaledPadding).toBeCloseTo(padding * 2)
    expect(scaledBorder).toBeCloseTo(border * 2)
  })

  it('без textScale шрифт растёт как scale', () => {
    const readFont = () => Number(readPdfStyle(screen.getByText('ИГРОКИ')).fontSize)
    const { rerender } = render(<PlayersTable />)
    const font = readFont()
    rerender(<PlayersTable scale={2} />)

    expect(readFont()).toBeCloseTo(font * 2)
  })
})
