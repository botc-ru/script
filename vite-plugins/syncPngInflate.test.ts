import { describe, expect, it } from 'vitest'

import { syncPngInflate } from './syncPngInflate.ts'

describe('syncPngInflate', () => {
  const { resolveId } = syncPngInflate()

  it('подменяет fflate для png-js', () => {
    expect(resolveId('fflate', '/app/node_modules/png-js/lib/png-js.browser.js'))
      .toMatch(/src\/pdf\/worker\/unzlib\.ts$/)
  })

  it('не трогает fflate в других пакетах и другие импорты png-js', () => {
    expect(resolveId('fflate', '/app/src/pdf/worker/unzlib.ts')).toBeNull()
    expect(resolveId('jay-peg', '/app/node_modules/png-js/lib/png-js.browser.js')).toBeNull()
  })
})
