import { Document } from '@react-pdf/renderer'

import type { ScriptPdfData } from '../types/ScriptPdfData'
import { getActiveJinxes } from '../utils/getActiveJinxes'
import { getNightOrder } from '../utils/getNightOrder'
import { getNightRoles } from '../utils/getNightRoles'
import { getOrderedRoles } from '../utils/getOrderedRoles'
import { getScriptSections } from '../utils/getScriptSections'
import { getScriptTitle } from '../utils/getScriptTitle'
import { NightOrderSheet } from './pages/NightOrderSheet'
import { PlayerSheet } from './pages/PlayerSheet'
import { StorytellerSheet } from './pages/StorytellerSheet'
import { PdfSettingsContext } from './PdfSettingsContext'

/** PDF сценария. Настройки задают состав листов и доходят до элементов через контекст. */
export function ScriptDocument({ script, roles, settings }: ScriptPdfData) {
  const title = getScriptTitle(script)
  const orderedRoles = getOrderedRoles(script, roles)
  const jinxes = getActiveJinxes(orderedRoles, roles)
  const sections = getScriptSections(orderedRoles, jinxes, roles)
  const nightRoles = getNightRoles(orderedRoles, roles, settings.playersCount)
  const firstNight = getNightOrder(nightRoles, 'first')
  const otherNight = getNightOrder(nightRoles, 'other')

  return (
    <PdfSettingsContext value={settings}>
      <Document title={title}>
        {settings.playerSheet && (
          <PlayerSheet title={title} script={script} sections={sections} jinxes={jinxes} />
        )}
        {settings.storytellerSheet && (
          <StorytellerSheet
            title={title}
            color={script.color}
            author={script.author}
            sections={sections}
            jinxes={jinxes}
            firstNight={firstNight}
            otherNight={otherNight}
          />
        )}
        {settings.nightOrder && (
          <NightOrderSheet
            title={title}
            color={script.color}
            firstNight={firstNight}
            otherNight={otherNight}
          />
        )}
      </Document>
    </PdfSettingsContext>
  )
}
