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
 * Превью прокручивается вместе со страницей и начинается с первого листа. Пока экран закрыт,
 * оно рисуется заранее и скрыто: при открытии страницы уже готовы и пустого экрана нет.
 */
export function LayoutScreen({
  isOpen,
  settings,
  onSettingsChange,
  blob,
  isError,
  onDownloadPdf,
}: LayoutScreenProps) {
  useEffect(() => {
    if (isOpen) window.scrollTo(0, 0)
  }, [isOpen])

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
      {isOpen && (
        <LayoutSettings
          settings={settings}
          onChange={onSettingsChange}
          onDownloadPdf={onDownloadPdf}
        />
      )}
      <div className={`layout-screen__preview${isOpen ? '' : ' layout-screen__preview--hidden'}`}>
        {renderPreview()}
      </div>
    </div>
  )
}
