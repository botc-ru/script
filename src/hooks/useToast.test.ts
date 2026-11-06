import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useToast } from './useToast'

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function renderShown() {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.showToast('Готово')
    })
    return result
  }

  it('сначала плавно скрывает уведомление, затем удаляет', () => {
    const result = renderShown()
    expect(result.current).toMatchObject({ message: 'Готово', isLeaving: false })

    advance(2500)
    expect(result.current).toMatchObject({ message: 'Готово', isLeaving: true })

    advance(200)
    expect(result.current.message).toBeNull()
  })

  it('новое уведомление продлевает показ', () => {
    const result = renderShown()

    advance(2400)
    act(() => {
      result.current.showToast('Ещё')
    })
    advance(2400)

    expect(result.current).toMatchObject({ message: 'Ещё', isLeaving: false })
  })

  it('новое уведомление отменяет исчезновение', () => {
    const result = renderShown()

    advance(2600)
    act(() => {
      result.current.showToast('Ещё')
    })
    advance(200)

    expect(result.current).toMatchObject({ message: 'Ещё', isLeaving: false })
  })
})
