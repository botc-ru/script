import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { downloadBlob } from './downloadBlob'

describe('downloadBlob', () => {
  const createObjectURL = vi.fn<(blob: Blob) => string>(() => 'blob:file')
  const revokeObjectURL = vi.fn()
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    Object.assign(URL, { createObjectURL, revokeObjectURL })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('скачивает файл с нужным именем', () => {
    downloadBlob('Буря.pdf', new Blob(['pdf']))

    expect(click).toHaveBeenCalledOnce()
    const link = click.mock.contexts[0] as HTMLAnchorElement
    expect(link.download).toBe('Буря.pdf')
    expect(link.href).toBe('blob:file')
  })

  it('не отдаёт браузеру тип PDF, иначе телефон откроет файл', () => {
    downloadBlob('Буря.pdf', new Blob(['pdf'], { type: 'application/pdf' }))

    const blob = createObjectURL.mock.calls[0]?.[0]
    expect(blob?.type).toBe('application/octet-stream')
    expect(blob?.size).toBe(3)
  })

  it('не отзывает ссылку сразу: скачивание может начаться позже', () => {
    downloadBlob('Буря.pdf', new Blob(['pdf']))
    expect(revokeObjectURL).not.toHaveBeenCalled()

    vi.runAllTimers()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:file')
  })
})
