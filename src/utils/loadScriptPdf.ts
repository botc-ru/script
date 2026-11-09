import type { ScriptPdfRequest } from '../pdf/worker/ScriptPdfRequest'
import type { ScriptPdfResponse } from '../pdf/worker/ScriptPdfResponse'
import type { RolesById } from '../types/RolesById'
import type { ScriptPdfData } from '../types/ScriptPdfData'

interface Pending {
  resolve: (blob: Blob) => void
  reject: (reason: unknown) => void
}

function abortError() {
  return new DOMException('Запрос PDF отменён', 'AbortError')
}

let worker: Worker | null = null
let sentRoles: RolesById | null = null
let nextId = 0
const pending = new Map<number, Pending>()

function settle({ id, ...result }: ScriptPdfResponse) {
  const request = pending.get(id)
  if (!request) return
  pending.delete(id)
  if ('blob' in result) request.resolve(result.blob)
  else request.reject(new Error(result.error))
}

function restart() {
  worker?.terminate()
  worker = null
  sentRoles = null
  for (const request of pending.values()) request.reject(new Error('Поток PDF упал'))
  pending.clear()
}

function getWorker() {
  if (worker) return worker
  worker = new Worker(new URL('../pdf/worker/scriptPdf.worker.ts', import.meta.url), { type: 'module' })
  worker.addEventListener('message', (event: MessageEvent<ScriptPdfResponse>) => settle(event.data))
  worker.addEventListener('error', restart)
  return worker
}

/**
 * Создаёт PDF сценария в отдельном потоке: основной поток и страница не тормозят.
 * Поток и код генерации загружаются при первом вызове: нужны они не всем посетителям.
 *
 * Запросы выполняются по очереди. `signal` отменяет запрос: если он ещё не начат, поток его
 * пропустит. Роли пересылаются в поток, только когда изменились.
 */
export function loadScriptPdf(
  { script, roles, settings }: ScriptPdfData,
  signal?: AbortSignal,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError())
      return
    }

    const target = getWorker()
    const id = nextId++
    const request: ScriptPdfRequest = { type: 'generate', id, script, settings }
    if (roles !== sentRoles) request.roles = roles
    sentRoles = roles
    pending.set(id, { resolve, reject })
    target.postMessage(request)

    signal?.addEventListener('abort', () => {
      if (!pending.delete(id)) return
      const cancel: ScriptPdfRequest = { type: 'cancel', id }
      target.postMessage(cancel)
      reject(abortError())
    }, { once: true })
  })
}
