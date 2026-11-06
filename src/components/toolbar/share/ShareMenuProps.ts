import type { ScriptData } from '../../../types/ScriptData'

export interface ShareMenuProps {
  script: ScriptData
  onImport: (script: ScriptData) => void
  onNotify: (message: string) => void
  onDownloadPdf?: () => void
}
