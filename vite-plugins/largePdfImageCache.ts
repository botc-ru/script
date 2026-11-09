/** Размер кэша картинок react-pdf в библиотеке. */
const LIBRARY_CACHE = 'createCache({ limit: 30 })'

/** Больше всех ролей вместе с фоном и логотипом: картинка не вытесняется, пока нужна. */
const CACHE_LIMIT = 300

/**
 * Плагин Vite: кэш картинок `@react-pdf/image` вмещает 300 картинок вместо 30.
 *
 * В сценарии из 30+ ролей старые картинки вытеснялись раньше, чем снова понадобятся, и кэш
 * не срабатывал: каждая генерация заново скачивала и разбирала все иконки, а иконки, которые
 * стоят на нескольких листах, по два раза. Если библиотека изменится и строки не окажется,
 * сборка упадёт: иначе кэш тихо вернётся к 30.
 */
export function largePdfImageCache() {
  return {
    name: 'large-pdf-image-cache',
    transform(code: string, id: string) {
      if (!/\/@react-pdf\/image\/lib\/index(\.browser)?\.js$/.test(id)) return null
      if (!code.includes(LIBRARY_CACHE)) {
        throw new Error(`large-pdf-image-cache: в ${id} нет «${LIBRARY_CACHE}»`)
      }
      return code.replace(LIBRARY_CACHE, `createCache({ limit: ${CACHE_LIMIT} })`)
    },
  }
}
