import type { RolesById } from '../../types/RolesById'
import type { ScriptPdfData } from '../../types/ScriptPdfData'
import type { ScriptPdfRequest } from './ScriptPdfRequest'
import type { ScriptPdfResponse } from './ScriptPdfResponse'

interface Job {
  id: number
  data: ScriptPdfData
}

/**
 * Очередь создания PDF внутри потока: запросы выполняются по одному, по порядку.
 *
 * Возвращает обработчик сообщений `ScriptPdfRequest`. Отменённый запрос пропускается, если ещё
 * не начат, и ответа на него нет. Запрос без ролей берёт роли из предыдущего.
 */
export function createPdfJobQueue(
  generate: (data: ScriptPdfData) => Promise<Blob>,
  respond: (response: ScriptPdfResponse) => void,
) {
  const queue: Job[] = []
  let roles: RolesById = {}
  let isRunning = false

  async function run() {
    if (isRunning) return
    isRunning = true
    for (let job = queue.shift(); job; job = queue.shift()) {
      const { id, data } = job
      try {
        respond({ id, blob: await generate(data) })
      } catch (error) {
        respond({ id, error: String(error) })
      }
    }
    isRunning = false
  }

  return (request: ScriptPdfRequest) => {
    if (request.type === 'cancel') {
      const index = queue.findIndex((job) => job.id === request.id)
      if (index !== -1) queue.splice(index, 1)
      return
    }

    roles = request.roles ?? roles
    const { id, script, settings } = request
    queue.push({ id, data: { script, settings, roles } })
    void run()
  }
}
