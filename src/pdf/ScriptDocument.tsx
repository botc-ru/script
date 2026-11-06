import { Document } from '@react-pdf/renderer'

import type { ScriptPdfData } from '../types/ScriptPdfData'
import { getActiveJinxes } from '../utils/getActiveJinxes'
import { getOrderedRoles } from '../utils/getOrderedRoles'
import { getScriptSections } from '../utils/getScriptSections'
import { PlayerSheet } from './pages/PlayerSheet'
import { PdfSettingsContext } from './PdfSettingsContext'

/** PDF сценария. Состав листов задают настройки, размеры шрифтов и фон они же через контекст. */
export function ScriptDocument({ script, roles, settings }: ScriptPdfData) {
  const title = script.name || 'Сценарий'
  const orderedRoles = getOrderedRoles(script, roles)
  const jinxes = getActiveJinxes(orderedRoles, roles)
  const sections = getScriptSections(orderedRoles, jinxes, roles)

  return (
    <PdfSettingsContext value={settings}>
      <Document title={title}>
        {settings.playerSheet && (
          <PlayerSheet title={title} script={script} sections={sections} jinxes={jinxes} />
        )}
      </Document>
    </PdfSettingsContext>
  )
}
