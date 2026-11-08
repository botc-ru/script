/** Заглушка глобального `Buffer`: в браузере настоящих буферов Node нет. */
const BUFFER_SHIM = { isBuffer: () => false }

/**
 * Подставляет глобальный `Buffer`, если его нет.
 *
 * react-pdf в браузере проверяет картинки через `Buffer.isBuffer`. Без `Buffer` проверка падает:
 * в консоль уходит предупреждение на каждую картинку, а одинаковые картинки встраиваются в PDF
 * заново, потому что у них не появляется ключ. Настоящий `Buffer`, если он есть, не трогается.
 */
export function installBufferShim() {
  const scope = globalThis as { Buffer?: unknown }
  scope.Buffer ??= BUFFER_SHIM
}
