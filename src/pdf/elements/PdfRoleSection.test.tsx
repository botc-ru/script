import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { readPdfStyle } from '../../test/readPdfStyle'
import { TEST_ROLES } from '../../test/testRoles'
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
      <PdfRoleSection title="Горожане" roles={ROLES} jinxes={[]} columns={2} isStretched />,
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
    // Секция забирает долю свободной высоты листа по числу строк
    expect(readPdfStyle(container.firstElementChild).flexGrow).toBe(2)
  })

  it('одну роль не растягивает', () => {
    const { container } = render(
      <PdfRoleSection title="Демоны" roles={ROLES.slice(0, 1)} jinxes={[]} columns={2} isStretched />,
    )

    expect(readPdfStyle(container.firstElementChild).flexGrow).toBeUndefined()
  })

  it('без ролей ничего не показывает', () => {
    const { container } = render(
      <PdfRoleSection title="Демоны" roles={[]} jinxes={[]} columns={1} />,
    )

    expect(container.childElementCount).toBe(0)
  })
})
