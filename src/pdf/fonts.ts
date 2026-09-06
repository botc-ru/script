import { Font } from '@react-pdf/renderer'
import robotoCondensed from '../assets/fonts/robotocondensed.ttf'
import robotoCondensedLight from '../assets/fonts/robotocondensed-light.ttf'
import robotoCondensedBold from '../assets/fonts/robotocondensed-bold.ttf'
import petersburg from '../assets/fonts/petersburgcyrillic.ttf'

let registered = false

export function registerPdfFonts() {
  if (registered) return
  registered = true

  Font.register({
    family: 'Roboto-Condensed',
    fonts: [
      { src: robotoCondensedLight, fontWeight: 300 },
      { src: robotoCondensed, fontWeight: 400 },
      { src: robotoCondensedBold, fontWeight: 700 },
    ],
  })
  Font.register({ family: 'Petersburg', src: petersburg })
}
