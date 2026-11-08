import { afterEach, describe, expect, it, vi } from 'vitest'

import { installBufferShim } from './installBufferShim'

function getBuffer() {
  return (globalThis as { Buffer?: { isBuffer: (value: unknown) => boolean } }).Buffer
}

describe('installBufferShim', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('подставляет Buffer, для которого ничто не буфер', () => {
    vi.stubGlobal('Buffer', undefined)

    installBufferShim()

    expect(getBuffer()?.isBuffer({ uri: 'role.png' })).toBe(false)
  })

  it('не трогает настоящий Buffer', () => {
    const buffer = { isBuffer: () => true }
    vi.stubGlobal('Buffer', buffer)

    installBufferShim()

    expect(getBuffer()).toBe(buffer)
  })
})
