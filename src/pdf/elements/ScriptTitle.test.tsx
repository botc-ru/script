import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { readPdfStyle } from '../../test/readPdfStyle'
import { TEST_ROLES } from '../../test/testRoles'
import { DEFAULT_PRINT_SETTINGS } from '../../utils/defaultPrintSettings'
import { DEFAULT_SCRIPT } from '../../utils/defaultScript'
import { ScriptDocument } from '../ScriptDocument'

interface MockProps {
  style?: object | object[]
  children?: ReactNode
}

// Стили текста складываются в атрибут, чтобы проверить цвет и размер
vi.mock('@react-pdf/renderer', () => ({
  StyleSheet: { create: (styles: unknown) => styles },
  Document: ({ children }: MockProps) => <div>{children}</div>,
  Page: ({ children }: MockProps) => <section>{children}</section>,
  View: ({ children }: MockProps) => <div>{children}</div>,
  Text: ({ style, children }: MockProps) => (
    <span data-style={JSON.stringify(Object.assign({}, ...[style].flat()))}>{children}</span>
  ),
  Image: () => null,
}))

describe('ScriptTitle', () => {
  it('на листе рассказчика и в порядке ночи название в цвете сценария и одного размера', () => {
    render(
      <ScriptDocument
        script={{ ...DEFAULT_SCRIPT, name: 'Сценарий', color: '#123456', roleIds: ['chef'] }}
        roles={TEST_ROLES}
        settings={{ ...DEFAULT_PRINT_SETTINGS, playerSheet: false }}
      />,
    )

    const styles = screen.getAllByText('Сценарий').map(readPdfStyle)

    // Лист рассказчика и две колонки порядка ночи
    expect(styles).toHaveLength(3)
    expect(styles.every((style) => style.color === '#123456')).toBe(true)
    expect(new Set(styles.map((style) => style.fontSize)).size).toBe(1)
  })
})
