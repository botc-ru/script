import { pdf } from '@react-pdf/renderer'

import type { ScriptPdfData } from '../types/ScriptPdfData'
import { registerPdfFonts } from './registerPdfFonts'
import { ScriptDocument } from './ScriptDocument'

registerPdfFonts()

/** Создаёт PDF сценария. Это точка входа отдельного файла сборки, см. `loadScriptPdf`. */
export function generateScriptPdf(data: ScriptPdfData): Promise<Blob> {
  return pdf(<ScriptDocument {...data} />).toBlob()
}
