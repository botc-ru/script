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
})
