import { openSync } from 'fontkit'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const FONTS_DIR = path.resolve(__dirname, '../assets/fonts')

describe('шрифты PDF', () => {
  it.each(['robotocondensed-light.ttf', 'robotocondensed.ttf', 'robotocondensed-bold.ttf'])(
    '%s рисует знак напоминания 𒊹 из подсказок порядка ночи',
    (file) => {
      const font = openSync(path.join(FONTS_DIR, file))
      if (!('hasGlyphForCodePoint' in font)) throw new Error('ожидался один шрифт')

      expect(font.hasGlyphForCodePoint(0x122b9)).toBe(true)
      expect(font.hasGlyphForCodePoint(0x416)).toBe(true)
    },
  )
})
