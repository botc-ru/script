import { Font } from '@react-pdf/renderer'

import petersburg from '../assets/fonts/petersburgcyrillic.ttf'
import petersburgBold from '../assets/fonts/petersburgcyrillic-bold.ttf'
import robotoCondensed from '../assets/fonts/robotocondensed.ttf'
import robotoCondensedBold from '../assets/fonts/robotocondensed-bold.ttf'
import robotoCondensedLight from '../assets/fonts/robotocondensed-light.ttf'

/**
 * Регистрирует шрифты PDF. Жирное начертание Petersburg создано из обычного:
 * см. `scripts/embolden-font.py`.
 */
export function registerPdfFonts() {
  Font.register({
    family: 'Roboto-Condensed',
    fonts: [
      { src: robotoCondensedLight, fontWeight: 300 },
      { src: robotoCondensed, fontWeight: 400 },
      { src: robotoCondensedBold, fontWeight: 700 },
    ],
  })
  Font.register({
    family: 'Petersburg',
    fonts: [
      { src: petersburg, fontWeight: 400 },
      { src: petersburgBold, fontWeight: 700 },
    ],
  })
}
