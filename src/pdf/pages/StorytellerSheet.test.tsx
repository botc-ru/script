import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { readPdfStyle } from '../../test/readPdfStyle'
import { DEFAULT_PRINT_SETTINGS } from '../../utils/defaultPrintSettings'
import { PdfSettingsContext } from '../PdfSettingsContext'
import { mm } from '../units'
import { SHEET_PADDING } from './sheetPadding'
import { StorytellerSheet } from './StorytellerSheet'

interface MockProps {
  style?: object | object[]
  children?: ReactNode
}

function toStyle(style: MockProps['style']) {
  return JSON.stringify(Object.assign({}, ...[style].flat(2)))
}

// Стили складываются в атрибут, чтобы сложить отступы от края листа
vi.mock('@react-pdf/renderer', () => ({
  StyleSheet: { create: (styles: unknown) => styles },
  Page: ({ children }: MockProps) => <section>{children}</section>,
  View: ({ style, children }: MockProps) => <div data-style={toStyle(style)}>{children}</div>,
  Text: ({ style, children }: MockProps) => <span data-style={toStyle(style)}>{children}</span>,
  Image: () => null,
}))

/** Отступы от бокового и нижнего краёв листа до рамки таблицы игроков. */
function readTableInset() {
  let element = screen.getByText('ИГРОКИ').parentElement
  const ancestors: Element[] = []
  while (element) {
    ancestors.push(element)
    element = element.parentElement
  }
  const border = ancestors.findLast((ancestor) => {
    return ancestor instanceof HTMLElement && readPdfStyle(ancestor).borderColor !== undefined
  })
  const styles = ancestors
    .slice(ancestors.indexOf(border ?? document.body) + 1)
    .filter((ancestor) => ancestor instanceof HTMLElement && 'style' in ancestor.dataset)
    .map(readPdfStyle)

  return {
    side: styles.reduce((sum, style) => {
      const { padding = 0, paddingHorizontal = padding, marginHorizontal = 0 } = style
      return sum + Number(paddingHorizontal) + Number(marginHorizontal)
    }, 0),
    bottom: styles.reduce((sum, { padding = 0, paddingBottom = padding, marginBottom = 0 }) => {
      return sum + Number(paddingBottom) + Number(marginBottom)
    }, 0),
  }
}

function renderSheet(nightOrderColumns: boolean) {
  render(
    <PdfSettingsContext value={{ ...DEFAULT_PRINT_SETTINGS, background: false, nightOrderColumns }}>
      <StorytellerSheet
        title="Сценарий"
        color="#000"
        author=""
        sections={[]}
        jinxes={[]}
        firstNight={[]}
        otherNight={[]}
      />
    </PdfSettingsContext>,
  )
}

describe('StorytellerSheet', () => {
  it('без колонок ночи таблица игроков стоит в 20 мм от боковых и нижнего краёв листа', () => {
    renderSheet(false)
    const { side, bottom } = readTableInset()

    expect(side).toBeCloseTo(mm(20))
    expect(bottom).toBeCloseTo(mm(20))
  })

  it('с колонками ночи у таблицы только поля листа, боковые как у листа игрока', () => {
    renderSheet(true)
    const { side, bottom } = readTableInset()

    expect(side).toBeCloseTo(mm(SHEET_PADDING.x))
    expect(bottom).toBeCloseTo(mm(SHEET_PADDING.bottom))
  })
})
