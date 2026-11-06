import type { PrintSettings } from '../../../types/PrintSettings'

export interface LayoutSettingsProps {
  settings: PrintSettings
  onChange: (settings: PrintSettings) => void
  onDownloadPdf?: () => void
}
