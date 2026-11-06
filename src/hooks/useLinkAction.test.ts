import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useLinkAction } from './useLinkAction'

describe('useLinkAction', () => {
  it('ждёт готовности и выполняет действие один раз', () => {
    window.history.replaceState(null, '', '/script/?action=pdf')
    const onAction = vi.fn()
    const { rerender } = renderHook(
      ({ isReady }) => {
        useLinkAction(isReady, onAction)
      },
      { initialProps: { isReady: false } },
    )
    expect(onAction).not.toHaveBeenCalled()

    rerender({ isReady: true })
    rerender({ isReady: true })

    expect(onAction).toHaveBeenCalledExactlyOnceWith('pdf')
  })

  it('убирает действие из адреса и сохраняет остальные параметры', () => {
    window.history.replaceState(null, '', '/script/?action=json&title=Буря')

    renderHook(() => {
      useLinkAction(true, vi.fn())
    })

    expect(window.location.search).toBe('?title=%D0%91%D1%83%D1%80%D1%8F')
  })

  it('без параметра ничего не делает', () => {
    window.history.replaceState(null, '', '/script/')
    const onAction = vi.fn()

    renderHook(() => {
      useLinkAction(true, onAction)
    })

    expect(onAction).not.toHaveBeenCalled()
  })
})
