import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { readPdfStyle } from '../../test/readPdfStyle'
import { DEFAULT_PRINT_SETTINGS } from '../../utils/defaultPrintSettings'
import { PdfSettingsContext } from '../PdfSettingsContext'
import { mm } from '../units'
import { NightColumn } from './NightColumn'
import { NightDetailColumn } from './NightDetailColumn'
import { NightTitle } from './NightTitle'

interface MockProps {
  style?: object | object[]
  children?: ReactNode
}

// Стили складываются в атрибут, чтобы проверить размер шрифта
vi.mock('@react-pdf/renderer', () => ({
  StyleSheet: { create: (styles: unknown) => styles },
  View: ({ children }: MockProps) => <div>{children}</div>,
  Text: ({ style, children }: MockProps) => (
    <span data-style={JSON.stringify(Object.assign({}, ...[style].flat()))}>{children}</span>
  ),
  Image: () => null,
}))

function getFontSize(text: string) {
  return Number(readPdfStyle(screen.getByText(text)).fontSize)
}

describe('NightTitle', () => {
  it('при крупном шрифте помещается в колонку шириной 32 мм', () => {
    render(
      <PdfSettingsContext value={{ ...DEFAULT_PRINT_SETTINGS, fontScale: 1.15 }}>
        <NightTitle title="Другие ночи" />
      </PdfSettingsContext>,
    )

    // «ДРУГИЕ НОЧИ» шрифтом Petersburg шириной около 8,25 кегля
    expect(getFontSize('Другие ночи') * 8.25).toBeLessThanOrEqual(mm(32))
  })

  it('одного размера на листе рассказчика и в подробном порядке ночи', () => {
    render(
      <>
        <NightColumn title="Первая ночь" entries={[]} />
        <NightDetailColumn title="Другие ночи" entries={[]} scriptTitle="Сценарий" />
      </>,
    )

    expect(getFontSize('Первая ночь')).toBe(getFontSize('Другие ночи'))
  })
})
