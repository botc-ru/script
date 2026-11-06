import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useHistoryState } from './useHistoryState'

describe('useHistoryState', () => {
  it('отменяет и повторяет изменения', () => {
    const { result } = renderHook(() => useHistoryState(() => 1))

    act(() => result.current.update(() => 2))
    expect(result.current).toMatchObject({ value: 2, canUndo: true, canRedo: false })

    act(() => result.current.undo())
    expect(result.current).toMatchObject({ value: 1, canUndo: false, canRedo: true })

    act(() => result.current.redo())
    expect(result.current).toMatchObject({ value: 2, canUndo: true, canRedo: false })
  })

  it('новое значение очищает шаги для повтора', () => {
    const { result } = renderHook(() => useHistoryState(() => 1))

    act(() => result.current.update(() => 2))
    act(() => result.current.undo())
    act(() => result.current.update(() => 3))

    expect(result.current).toMatchObject({ value: 3, canRedo: false })
  })

  it('хранит не больше 50 шагов', () => {
    const { result } = renderHook(() => useHistoryState(() => 0))

    for (let step = 1; step <= 60; step++) {
      act(() => result.current.update(() => step))
    }
    for (let step = 0; step < 60; step++) {
      act(() => result.current.undo())
    }

    expect(result.current.value).toBe(10)
  })
})
