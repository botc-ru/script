import { describe, expect, it, vi } from 'vitest'

import { TEST_ROLES } from '../../test/testRoles'
import type { ScriptPdfData } from '../../types/ScriptPdfData'
import { DEFAULT_PRINT_SETTINGS } from '../../utils/defaultPrintSettings'
import { DEFAULT_SCRIPT } from '../../utils/defaultScript'
import { createPdfJobQueue } from './createPdfJobQueue'
import type { ScriptPdfResponse } from './ScriptPdfResponse'

const BASE = { type: 'generate', script: DEFAULT_SCRIPT, settings: DEFAULT_PRINT_SETTINGS } as const

function setup() {
  const finishers: (() => void)[] = []
  const generate = vi.fn((data: ScriptPdfData) => new Promise<Blob>((resolve) => {
    finishers.push(() => resolve(new Blob([data.script.name])))
  }))
  const responses: ScriptPdfResponse[] = []
  const handle = createPdfJobQueue(generate, (response) => responses.push(response))

  function finishNext() {
    finishers.shift()?.()
  }

  return { generate, responses, handle, finishNext }
}

describe('createPdfJobQueue', () => {
  it('создаёт файлы по одному, по порядку', async () => {
    const { generate, responses, handle, finishNext } = setup()

    handle({ ...BASE, id: 1, roles: TEST_ROLES })
    handle({ ...BASE, id: 2 })
    expect(generate).toHaveBeenCalledOnce()

    finishNext()
    await vi.waitFor(() => expect(generate).toHaveBeenCalledTimes(2))
    finishNext()

    await vi.waitFor(() => expect(responses.map(({ id }) => id)).toEqual([1, 2]))
  })

  it('запрос без ролей берёт роли из предыдущего', async () => {
    const { generate, responses, handle, finishNext } = setup()

    handle({ ...BASE, id: 1, roles: TEST_ROLES })
    finishNext()
    await vi.waitFor(() => expect(responses).toHaveLength(1))
    handle({ ...BASE, id: 2 })

    await vi.waitFor(() => expect(generate).toHaveBeenCalledTimes(2))
    expect(generate.mock.calls[1]?.[0].roles).toBe(TEST_ROLES)
  })

  it('пропускает отменённый запрос, который ещё не начат', async () => {
    const { generate, responses, handle, finishNext } = setup()

    handle({ ...BASE, id: 1, roles: TEST_ROLES })
    handle({ ...BASE, id: 2 })
    handle({ ...BASE, id: 3 })
    handle({ type: 'cancel', id: 2 })
    finishNext()
    await vi.waitFor(() => expect(generate).toHaveBeenCalledTimes(2))
    finishNext()

    await vi.waitFor(() => expect(responses.map(({ id }) => id)).toEqual([1, 3]))
  })

  it('передаёт ошибку и продолжает очередь', async () => {
    const responses: ScriptPdfResponse[] = []
    const generate = vi.fn()
      .mockRejectedValueOnce(new Error('Нет шрифта'))
      .mockResolvedValueOnce(new Blob(['pdf']))
    const handle = createPdfJobQueue(generate, (response) => responses.push(response))

    handle({ ...BASE, id: 1, roles: TEST_ROLES })
    handle({ ...BASE, id: 2 })

    await vi.waitFor(() => expect(responses).toHaveLength(2))
    expect(responses[0]).toEqual({ id: 1, error: 'Error: Нет шрифта' })
    expect(responses[1]).toHaveProperty('blob')
  })
})
