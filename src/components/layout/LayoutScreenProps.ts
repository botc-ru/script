import type { PrintSettings } from '../../types/PrintSettings'

export interface LayoutScreenProps {
  settings: PrintSettings
  onSettingsChange: (settings: PrintSettings) => void
  blob: Blob | null
  isError: boolean
  onDownloadPdf?: () => void
}
