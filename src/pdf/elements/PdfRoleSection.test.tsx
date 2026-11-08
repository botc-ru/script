import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { readPdfStyle } from '../../test/readPdfStyle'
import { TEST_ROLES } from '../../test/testRoles'
import { DEFAULT_PRINT_SETTINGS } from '../../utils/defaultPrintSettings'
import { PdfSettingsContext } from '../PdfSettingsContext'
import { PdfRoleSection } from './PdfRoleSection'

interface MockProps {
  style?: object | object[]
  children?: ReactNode
}

function toStyle(style: MockProps['style']) {
  return JSON.stringify(Object.assign({}, ...[style].flat()))
}

// Стили складываются в атрибут, чтобы проверить раскладку
vi.mock('@react-pdf/renderer', () => ({
  StyleSheet: { create: (styles: unknown) => styles },
  View: ({ style, children }: MockProps) => <div data-style={toStyle(style)}>{children}</div>,
  Text: ({ children }: MockProps) => <span>{children}</span>,
  Image: () => null,
}))

const ROLES = ['librarian', 'chef', 'drunk'].flatMap((id) => TEST_ROLES[id] ?? [])

describe('PdfRoleSection', () => {
  it('при «Растянуть» делит высоту между строками поровну, а роли ставит по центру', () => {
    const { container } = render(
      <PdfSettingsContext value={{ ...DEFAULT_PRINT_SETTINGS, stretch: true, columns: 2 }}>
        <PdfRoleSection title="Горожане" roles={ROLES} jinxes={[]} />
      </PdfSettingsContext>,
    )

    const views = [...container.querySelectorAll('[data-style]')]
    const rows = views.filter((view) => {
      const style = readPdfStyle(view)
      return style.flexGrow === 1 && style.flexDirection === 'row'
    })
    const cells = views.filter((view) => readPdfStyle(view).justifyContent === 'center')

    // 3 роли в 2 колонки: 2 строки по 2 ячейки, вторая ячейка второй строки пустая
    expect(rows).toHaveLength(2)
    expect(cells).toHaveLength(4)
    expect(rows.every((row) => row.children.length === 2)).toBe(true)
  })
})
