import { lazy, Suspense, useEffect, useMemo, useRef } from 'react'
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
  rolesLoading: boolean
  script: ScriptMeta
  settings: PrintSettings
  active: boolean
  onSettingsChange: (settings: PrintSettings) => void
  onDownloadPdf: () => void
}

export function PrintScreen({
  scriptRoles,
  allRoles,
  rolesLoading,
  script,
  settings,
  active,
  onSettingsChange,
  onDownloadPdf,
}: PrintScreenProps) {
  const document = useMemo(
    () => (
      <ScriptPdfDocument script={script} roles={scriptRoles} allRoles={allRoles} settings={settings} />
    ),
    [script, scriptRoles, allRoles, settings],
  )
  const [instance, updateInstance] = usePDF()

  // Настоящий первый рендер — как только роли подгрузятся с сервера (до этого
  // scriptRoles пуст, даже если в сценарии что-то выбрано). Рендерим сразу при
  // монтировании, а не по явному действию пользователя, чтобы открытие вкладки
  // «Макет» в первый раз было мгновенным.
  const hasInitialRenderRef = useRef(false)
  useEffect(() => {
    if (rolesLoading || hasInitialRenderRef.current) return
    hasInitialRenderRef.current = true
    updateInstance(document)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesLoading])

  // Дальше перерендер только по явному открытию вкладки «Макет» или изменению
  // настроек печати — правки на вкладках «Просмотр»/«Роли» не должны его вызывать.
  const isSettingsEffectFirstRun = useRef(true)
  useEffect(() => {
    if (isSettingsEffectFirstRun.current) {
      isSettingsEffectFirstRun.current = false
      return
    }
    if (active) updateInstance(document)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, active])

  return (
    <div className="app app--print">
      <PrintSettingsPanel settings={settings} onChange={onSettingsChange} onDownloadPdf={onDownloadPdf} />
      {instance.blob && (
        <Suspense fallback={<p>Загрузка просмотрщика...</p>}>
          <PdfPreview blob={instance.blob} />
        </Suspense>
      )}
    </div>
  )
}
