import type { ScriptPdfData } from '../types/ScriptPdfData'

/** Создаёт PDF сценария. Код генерации загружается отдельно: нужен он не всем посетителям. */
export async function loadScriptPdf(data: ScriptPdfData): Promise<Blob> {
  const { generateScriptPdf } = await import('../pdf/generateScriptPdf')
  return generateScriptPdf(data)
}
