import { unzlibSync } from 'fflate'

/**
 * Распаковка zlib без отдельного потока, на замену `unzlib` из fflate для png-js.
 *
 * Асинхронный `unzlib` запускает новый поток на каждый вызов, то есть на каждую PNG-картинку
 * в PDF. PDF и так создаётся в своём потоке, поэтому лишние потоки только тратят память
 * и время на запуск. Подключается плагином `syncPngInflate` в `vite.config.ts`.
 */
export function unzlib(
  data: Uint8Array,
  callback: (error: Error | null, result: Uint8Array | null) => void,
) {
  let result: Uint8Array
  try {
    result = unzlibSync(data)
  } catch (error) {
    callback(error instanceof Error ? error : new Error(String(error)), null)
    return
  }
  callback(null, result)
}
