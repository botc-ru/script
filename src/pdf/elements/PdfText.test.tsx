/// <reference types="node" />
import { Document, Font, Page, renderToBuffer } from '@react-pdf/renderer'
import { beforeAll, describe, expect, it } from 'vitest'

import { PdfText } from './PdfText'

function fontPath(file: string) {
  return `${process.cwd()}/src/assets/fonts/${file}`
}

async function renderText(text: string) {
  const buffer = await renderToBuffer(
    <Document>
      <Page>
        <PdfText>{text}</PdfText>
      </Page>
    </Document>,
  )
  return buffer.toString('latin1')
}

describe('PdfText', () => {
  beforeAll(() => {
    Font.register({ family: 'Roboto-Condensed', src: fontPath('robotocondensed-light.ttf'), fontWeight: 300 })
    Font.register({ family: 'Token', src: fontPath('token.ttf') })
  })

  it('берёт значок жетона «𒊹» из шрифта Token: в Roboto Condensed его нет', async () => {
    expect(await renderText('Положи 𒊹 рядом')).toContain('Token-Regular')
  })

  it('не встраивает шрифт Token, если значка жетона нет', async () => {
    expect(await renderText('Положи жетон рядом')).not.toContain('Token-Regular')
  })
})
