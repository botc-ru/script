import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ScriptPdfRequest } from '../pdf/worker/ScriptPdfRequest'
import type { ScriptPdfResponse } from '../pdf/worker/ScriptPdfResponse'
import { TEST_ROLES } from '../test/testRoles'
import { DEFAULT_PRINT_SETTINGS } from './defaultPrintSettings'
import { DEFAULT_SCRIPT } from './defaultScript'

class FakeWorker extends EventTarget {
  static instances: FakeWorker[] = []
  readonly sent: ScriptPdfRequest[] = []
  readonly terminate = vi.fn()

  constructor() {
    super()
    FakeWorker.instances.push(this)
  }

  postMessage(request: ScriptPdfRequest) {
    this.sent.push(request)
  }

  respond(response: ScriptPdfResponse) {
    this.dispatchEvent(new MessageEvent('message', { data: response }))
  }
}

const DATA = { script: DEFAULT_SCRIPT, roles: TEST_ROLES, settings: DEFAULT_PRINT_SETTINGS }

async function load() {
  vi.resetModules()
  return (await import('./loadScriptPdf')).loadScriptPdf
}

function lastWorker() {
  const worker = FakeWorker.instances.at(-1)
  if (!worker) throw new Error('Поток не создан')
  return worker
}

describe('loadScriptPdf', () => {
  beforeEach(() => {
    FakeWorker.instances = []
    vi.stubGlobal('Worker', FakeWorker)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('создаёт PDF в потоке и возвращает файл', async () => {
    const loadScriptPdf = await load()
    const blob = new Blob(['pdf'])

    const result = loadScriptPdf(DATA)
    lastWorker().respond({ id: 0, blob })

    await expect(result).resolves.toBe(blob)
  })

  it('создаёт поток один раз и пересылает роли, только когда они изменились', async () => {
    const loadScriptPdf = await load()

    void loadScriptPdf(DATA)
    void loadScriptPdf(DATA)
    void loadScriptPdf({ ...DATA, roles: { ...TEST_ROLES } })

    expect(FakeWorker.instances).toHaveLength(1)
    const sent = lastWorker().sent.map((request) => 'roles' in request)
    expect(sent).toEqual([true, false, true])
  })

  it('передаёт ошибку потока', async () => {
    const loadScriptPdf = await load()

    const result = loadScriptPdf(DATA)
    lastWorker().respond({ id: 0, error: 'Нет шрифта' })

    await expect(result).rejects.toThrow('Нет шрифта')
  })

  it('при отмене отклоняет запрос и просит поток его пропустить', async () => {
    const loadScriptPdf = await load()
    const controller = new AbortController()

    const result = loadScriptPdf(DATA, controller.signal)
    controller.abort()

    await expect(result).rejects.toBeDefined()
    expect(lastWorker().sent.at(-1)).toEqual({ type: 'cancel', id: 0 })
  })

  it('при сбое потока отклоняет запросы и создаёт поток заново', async () => {
    const loadScriptPdf = await load()

    const result = loadScriptPdf(DATA)
    const broken = lastWorker()
    broken.dispatchEvent(new Event('error'))

    await expect(result).rejects.toThrow('Поток PDF упал')
    expect(broken.terminate).toHaveBeenCalledOnce()
    void loadScriptPdf(DATA)
    expect(FakeWorker.instances).toHaveLength(2)
    expect(lastWorker().sent[0]).toHaveProperty('roles')
  })
})
