import { resolve } from 'node:path'

const UNZLIB = resolve(import.meta.dirname, '../src/pdf/worker/unzlib.ts')

/**
 * Плагин Vite: png-js получает `unzlib` из `src/pdf/worker/unzlib.ts` вместо fflate.
 * Остальные импорты fflate не меняются. Нужен и сборке потока PDF, и dev-оптимизатору
 * зависимостей: react-pdf с png-js собирается в оба места.
 */
export function syncPngInflate() {
  return {
    name: 'sync-png-inflate',
    enforce: 'pre' as const,
    resolveId(source: string, importer?: string) {
      if (source === 'fflate' && importer?.includes('/png-js/')) return UNZLIB
      return null
    },
  }
}
