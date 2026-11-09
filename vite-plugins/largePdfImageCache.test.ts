import { describe, expect, it } from 'vitest'

import { largePdfImageCache } from './largePdfImageCache.ts'

const LIBRARY = '/app/node_modules/@react-pdf/image/lib/index.browser.js'

describe('largePdfImageCache', () => {
  const { transform } = largePdfImageCache()

  it('увеличивает кэш картинок react-pdf', () => {
    expect(transform('const IMAGE_CACHE = createCache({ limit: 30 });', LIBRARY))
      .toBe('const IMAGE_CACHE = createCache({ limit: 300 });')
  })

  it('не трогает другие файлы', () => {
    expect(transform('createCache({ limit: 30 })', '/app/node_modules/other/index.js')).toBeNull()
  })

  it('падает, если библиотека изменилась', () => {
    expect(() => transform('const IMAGE_CACHE = new Map()', LIBRARY)).toThrow(/limit: 30/)
  })
})
