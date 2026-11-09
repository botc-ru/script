import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { useEffect, useRef, useState } from 'react'

import type { PdfPreviewProps } from './PdfPreviewProps'

import './PdfPreview.css'

GlobalWorkerOptions.workerSrc = workerSrc

/**
 * Запас чёткости, чтобы текст не расплывался при увеличении страницы пальцами.
 * Нужен только на сенсорных экранах: на ПК страницу не увеличивают, а холст в 1,5 раза шире
 * занимает в 2,25 раза больше памяти.
 */
const ZOOM_RESERVE = 1.5

function getZoomReserve() {
  return window.matchMedia('(pointer: coarse)').matches ? ZOOM_RESERVE : 1
}

/** Освобождает память холстов сразу: Safari иначе держит её до сборки мусора. */
function releaseCanvases(canvases: Iterable<Element>) {
  for (const canvas of canvases) {
    if (!(canvas instanceof HTMLCanvasElement)) continue
    canvas.width = 0
    canvas.height = 0
  }
}

/**
 * Превью PDF: страницы на холстах друг под другом.
 *
 * Встроенный просмотр браузера не подходит: мобильный Chrome показывает вместо него кнопку
 * «Открыть». Новые страницы рисуются вне экрана и заменяют старые разом, поэтому превью
 * не моргает и прокрутка не сбивается. Размер холста считается от ширины контейнера:
 * у iOS есть лимит площади холста.
 *
 * Документ pdf.js закрывается сразу после отрисовки или при смене файла, а память заменённых
 * холстов освобождается: превью держит в памяти только показанные страницы.
 *
 * Превью затемнено, пока показанные страницы устарели: `isStale` говорит, что новый PDF ещё
 * создаётся, а затем страницы затемнены до конца отрисовки готового файла.
 */
export function PdfPreview({ blob, isStale }: PdfPreviewProps) {
  const pagesRef = useRef<HTMLDivElement>(null)
  const [renderedBlob, setRenderedBlob] = useState<Blob | null>(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const container = pagesRef.current
    if (!container) return

    let isCurrent = true
    const loading = blob.arrayBuffer().then((data) => getDocument({ data }))
    const canvases: HTMLCanvasElement[] = []
    let isClosed = false

    function close() {
      if (isClosed) return
      isClosed = true
      void loading.then((task) => task.destroy())
    }

    async function renderPages(element: HTMLDivElement) {
      const pdf = await (await loading).promise

      for (let number = 1; number <= pdf.numPages && isCurrent; number++) {
        const page = await pdf.getPage(number)
        const width = element.clientWidth * window.devicePixelRatio * getZoomReserve()
        const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width })
        const canvas = document.createElement('canvas')
        canvas.className = 'pdf-preview__page'
        canvas.width = viewport.width
        canvas.height = viewport.height
        canvases.push(canvas)
        await page.render({ canvas, viewport }).promise
      }

      if (!isCurrent) {
        releaseCanvases(canvases)
        return
      }
      releaseCanvases(element.children)
      element.replaceChildren(...canvases)
      setRenderedBlob(blob)
      setIsError(false)
    }

    renderPages(container)
      .catch(() => {
        releaseCanvases(canvases)
        if (isCurrent) setIsError(true)
      })
      .finally(close)

    return () => {
      isCurrent = false
      close()
    }
  }, [blob])

  useEffect(() => {
    const container = pagesRef.current
    return () => {
      if (container) releaseCanvases(container.children)
    }
  }, [])

  const isUpdating = !isError && (isStale || renderedBlob !== blob)

  return (
    <>
      {isError && <p className="pdf-preview__message">Не удалось показать PDF</p>}
      <div className="pdf-preview" ref={pagesRef} aria-busy={isUpdating} />
    </>
  )
}
