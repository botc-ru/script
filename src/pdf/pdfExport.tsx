import { pdf } from '@react-pdf/renderer'
import { ScriptPdfDocument } from './ScriptPdfDocument'
import type { ScriptMeta } from '../scriptModel'
import type { Role, RolesById } from '../types'
import type { PrintSettings } from '../print'

interface DownloadScriptPdfArgs {
  script: ScriptMeta
  roles: Role[]
  allRoles: RolesById
  settings: PrintSettings
}

export async function downloadScriptPdf({ script, roles, allRoles, settings }: DownloadScriptPdfArgs) {
  const blob = await pdf(
    <ScriptPdfDocument script={script} roles={roles} allRoles={allRoles} settings={settings} />,
  ).toBlob()

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${script.name || 'script'}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}
