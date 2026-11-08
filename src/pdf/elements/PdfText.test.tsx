import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { PdfText } from './PdfText'

interface MockProps {
  children?: ReactNode
}

// Каждый текстовый кусок отдельным элементом: так видно, на сколько кусков разбит текст
vi.mock('@react-pdf/renderer', () => ({
  StyleSheet: { create: (styles: unknown) => styles },
  Text: ({ children }: MockProps) => (
    <span>
      {[children].flat().map((child, index) =>
        typeof child === 'string' ? <i key={index}>{child}</i> : child,
      )}
    </span>
  ),
}))

describe('PdfText', () => {
  it('выводит добавку к составу одним куском со скобками', () => {
    // На стыке кусков @react-pdf в браузере рвёт слово с дефисом: «[-» и «+2 Изгоя]»
    render(<PdfText modifications="+2 Изгоя">Способность.</PdfText>)

    expect(screen.getByText('[+2 Изгоя]', { exact: false }).textContent).toBe(' [+2 Изгоя]')
  })
})
