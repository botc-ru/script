import { afterEach, describe, expect, it, vi } from 'vitest'

import { runViewTransition } from './runViewTransition'

describe('runViewTransition', () => {
  afterEach(() => {
    Reflect.deleteProperty(document, 'startViewTransition')
  })

  it('без поддержки в браузере применяет обновление сразу', () => {
    const update = vi.fn()

    runViewTransition(update)

    expect(update).toHaveBeenCalledOnce()
  })

  it('применяет обновление внутри перехода', () => {
    const update = vi.fn()
    const startViewTransition = vi.fn<(callback: () => void) => void>()
    Object.assign(document, { startViewTransition })

    runViewTransition(update)
    expect(update).not.toHaveBeenCalled()

    startViewTransition.mock.calls[0]?.[0]()
    expect(update).toHaveBeenCalledOnce()
  })
})
