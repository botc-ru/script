import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Toast } from './Toast'

describe('Toast', () => {
  it('показывает сообщение', () => {
    render(<Toast message="Готово" isLeaving={false} />)

    const toast = screen.getByRole('status')
    expect(toast.textContent).toBe('Готово')
    expect(toast.className).not.toContain('toast--leaving')
  })

  it('при исчезновении получает отдельный класс', () => {
    render(<Toast message="Готово" isLeaving />)

    expect(screen.getByRole('status').className).toContain('toast--leaving')
  })
})
