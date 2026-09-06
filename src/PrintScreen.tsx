import { lazy, Suspense, useEffect, useMemo } from 'react'
import { usePDF } from '@react-pdf/renderer'
import { PrintSettingsPanel } from './PrintSettingsPanel'
import { ScriptPdfDocument } from './pdf/ScriptPdfDocument'
import type { PrintSettings } from './print'
import type { ScriptMeta } from './scriptModel'
import type { Role, RolesById } from './types'
import './App.css'

const PdfPreview = lazy(() => import('./PdfPreview').then((m) => ({ default: m.PdfPreview })))

interface PrintScreenProps {
  scriptRoles: Role[]
  allRoles: RolesById
  script: ScriptMeta
  settings: PrintSettings
  onSettingsChange: (settings: PrintSettings) => void
}

export function PrintScreen({
  scriptRoles,
  allRoles,
  script,
  settings,
  onSettingsChange,
}: PrintScreenProps) {
  const document = useMemo(
    () => (
      <ScriptPdfDocument script={script} roles={scriptRoles} allRoles={allRoles} settings={settings} />
    ),
    [script, scriptRoles, allRoles, settings],
  )
  const [instance, updateInstance] = usePDF()
  useEffect(() => {
    updateInstance(document)
  }, [document, updateInstance])

  return (
    <div className="app">
      <PrintSettingsPanel settings={settings} onChange={onSettingsChange} />
      {instance.blob && (
        <Suspense fallback={<p>Загрузка просмотрщика...</p>}>
          <PdfPreview blob={instance.blob} />
        </Suspense>
      )}
    </div>
  )
}
