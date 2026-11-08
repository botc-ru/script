import { zlibSync } from 'fflate'
import { describe, expect, it, vi } from 'vitest'

import { unzlib } from './unzlib'

describe('unzlib', () => {
  it('распаковывает данные сразу, без отдельного потока', () => {
    const data = new TextEncoder().encode('пиксели картинки')
    const callback = vi.fn<(error: Error | null, result: Uint8Array | null) => void>()

    unzlib(zlibSync(data), callback)

    expect(callback).toHaveBeenCalledOnce()
    const [error, result] = callback.mock.calls[0] ?? []
    expect(error).toBeNull()
    expect([...result ?? []]).toEqual([...data])
  })

  it('передаёт ошибку повреждённых данных', () => {
    const callback = vi.fn()

    unzlib(new Uint8Array([1, 2, 3, 4, 5, 6]), callback)

    expect(callback).toHaveBeenCalledExactlyOnceWith(expect.any(Error), null)
  })
})
