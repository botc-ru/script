import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { readPdfStyle } from '../../test/readPdfStyle'
import { NightColumn } from './NightColumn'

interface MockProps {
  style?: object | object[]
  children?: ReactNode
}

function toStyle(style: MockProps['style']) {
  return JSON.stringify(Object.assign({}, ...[style].flat()))
}

// Стили складываются в атрибут, чтобы сравнить ширину
vi.mock('@react-pdf/renderer', () => ({
  StyleSheet: { create: (styles: unknown) => styles },
  View: ({ style, children }: MockProps) => <div data-style={toStyle(style)}>{children}</div>,
  Text: ({ children }: MockProps) => <span>{children}</span>,
  Image: () => null,
}))

describe('NightColumn', () => {
  it('скрытая оставляет пустое место той же ширины', () => {
    const { container } = render(
      <>
        <NightColumn title="Первая ночь" entries={[]} />
        <NightColumn title="Другие ночи" entries={[]} isHidden />
      </>,
    )
    const [shown, hidden] = [...container.children].map(readPdfStyle)

    expect(screen.queryByText('Другие ночи')).toBeNull()
    expect(hidden?.width).toBe(shown?.width)
    expect(hidden?.flexShrink).toBe(0)
  })
})
