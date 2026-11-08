import { pdf } from '@react-pdf/renderer'

import type { ScriptPdfData } from '../types/ScriptPdfData'
import { registerPdfFonts } from './registerPdfFonts'
import { ScriptDocument } from './ScriptDocument'

registerPdfFonts()

/** Создаёт PDF сценария. Вызывается в потоке PDF, см. `worker/scriptPdf.worker.ts`. */
export function generateScriptPdf(data: ScriptPdfData): Promise<Blob> {
  return pdf(<ScriptDocument {...data} />).toBlob()
}
