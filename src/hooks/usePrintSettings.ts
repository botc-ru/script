import { useEffect, useState } from 'react'

import { loadPrintSettings, savePrintSettings } from '../utils/printSettingsStorage'

/** Настройки макета. Хранятся в localStorage отдельно от сценария и общие для всех сценариев. */
export function usePrintSettings() {
  const [settings, setSettings] = useState(loadPrintSettings)

  useEffect(() => {
    savePrintSettings(settings)
  }, [settings])

  return [settings, setSettings] as const
}
