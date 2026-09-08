import { useEffect, useMemo, useRef } from 'react'
import { usePDF } from '@react-pdf/renderer'
import { ScriptPdfDocument } from './pdf/ScriptPdfDocument'
import type { PrintSettings } from './print'
import type { ScriptMeta } from './scriptModel'
import type { Role, RolesById } from './types'

interface UsePrintPdfOptions {
  script: ScriptMeta
  scriptRoles: Role[]
  allRoles: RolesById
  rolesLoading: boolean
  settings: PrintSettings
  active: boolean
}

export function usePrintPdf({
  script,
  scriptRoles,
  allRoles,
  rolesLoading,
  settings,
  active,
}: UsePrintPdfOptions) {
  const document = useMemo(
    () => (
      <ScriptPdfDocument script={script} roles={scriptRoles} allRoles={allRoles} settings={settings} />
    ),
    [script, scriptRoles, allRoles, settings],
  )
  const [instance, updateInstance] = usePDF()

  const hasInitialRenderRef = useRef(false)
  useEffect(() => {
    if (rolesLoading || hasInitialRenderRef.current) return
    hasInitialRenderRef.current = true
    updateInstance(document)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesLoading])

  const isSettingsEffectFirstRun = useRef(true)
  useEffect(() => {
    if (isSettingsEffectFirstRun.current) {
      isSettingsEffectFirstRun.current = false
      return
    }
    if (active) updateInstance(document)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, active])

  return instance.blob
}
