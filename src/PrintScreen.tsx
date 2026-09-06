import { PDFViewer } from '@react-pdf/renderer'
import { PrintSettingsPanel } from './PrintSettingsPanel'
import { ScriptPdfDocument } from './pdf/ScriptPdfDocument'
import type { PrintSettings } from './print'
import type { ScriptMeta } from './scriptModel'
import type { Role, RolesById } from './types'
import './App.css'

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
  return (
    <div className="app">
      <PrintSettingsPanel settings={settings} onChange={onSettingsChange} />
      <PDFViewer className="print-preview" style={{ width: '100%', height: '100%' }} showToolbar>
        <ScriptPdfDocument script={script} roles={scriptRoles} allRoles={allRoles} settings={settings} />
      </PDFViewer>
    </div>
  )
}
