import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { useEffect, useRef, useState } from 'react'

import type { PdfPreviewProps } from './PdfPreviewProps'

import './PdfPreview.css'

GlobalWorkerOptions.workerSrc = workerSrc

/** Запас чёткости, чтобы текст не расплывался при увеличении страницы на телефоне. */
const ZOOM_RESERVE = 1.5

/**
 * Превью PDF: страницы на холстах друг под другом.
 *
 * Встроенный просмотр браузера не подходит: мобильный Chrome показывает вместо него кнопку
 * «Открыть». Новые страницы рисуются вне экрана и заменяют старые разом, поэтому превью
 * не моргает и прокрутка не сбивается. Размер холста считается от ширины контейнера:
 * у iOS есть лимит площади холста.
 */
export function PdfPreview({ blob }: PdfPreviewProps) {
  const pagesRef = useRef<HTMLDivElement>(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const container = pagesRef.current
    if (!container) return

    let isCurrent = true
    const loading = blob.arrayBuffer().then((data) => getDocument({ data }))

    async function renderPages(element: HTMLDivElement) {
      const pdf = await (await loading).promise
      const canvases: HTMLCanvasElement[] = []

      for (let number = 1; number <= pdf.numPages; number++) {
        const page = await pdf.getPage(number)
        const width = element.clientWidth * window.devicePixelRatio * ZOOM_RESERVE
        const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width })
        const canvas = document.createElement('canvas')
        canvas.className = 'pdf-preview__page'
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvas, viewport }).promise
        canvases.push(canvas)
      }

      if (!isCurrent) return
      element.replaceChildren(...canvases)
      setIsError(false)
    }

    renderPages(container).catch(() => {
      if (isCurrent) setIsError(true)
    })

    return () => {
      isCurrent = false
      void loading.then((task) => task.destroy())
    }
  }, [blob])

  return (
    <>
      {isError && <p className="pdf-preview__message">Не удалось показать PDF</p>}
      <div className="pdf-preview" ref={pagesRef} />
    </>
  )
}
