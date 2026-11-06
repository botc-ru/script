import { lazy, Suspense, useEffect } from 'react'

import { hasPdfPages } from '../../utils/hasPdfPages'
import type { LayoutScreenProps } from './LayoutScreenProps'
import { LayoutSettings } from './settings/LayoutSettings'

import './LayoutScreen.css'

const PdfPreview = lazy(() => import('./preview/PdfPreview').then(({ PdfPreview }) => (
  { default: PdfPreview }
)))

/**
 * Экран «Макет»: настройки и превью PDF вместо сценария.
 *
 * Превью прокручивается вместе со страницей и начинается с первого листа.
 * Код просмотра PDF загружается отдельно, только при открытии экрана.
 */
export function LayoutScreen({
  settings,
  onSettingsChange,
  blob,
  isError,
  onDownloadPdf,
}: LayoutScreenProps) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const loading = <p className="layout-screen__message">Создаём PDF...</p>

  function renderPreview() {
    if (!hasPdfPages(settings)) {
      return <p className="layout-screen__message">Включите хотя бы один лист</p>
    }

    return (
      <>
        {isError && <p className="layout-screen__message">Не удалось создать PDF</p>}
        {blob && <Suspense fallback={loading}><PdfPreview blob={blob} /></Suspense>}
        {!blob && !isError && loading}
      </>
    )
  }

  return (
    <div className="layout-screen">
      <LayoutSettings
        settings={settings}
        onChange={onSettingsChange}
        onDownloadPdf={onDownloadPdf}
      />
      <div className="layout-screen__preview">{renderPreview()}</div>
    </div>
  )
}
