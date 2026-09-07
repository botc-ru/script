import { useEffect, useRef, useState } from 'react'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import './PdfPreview.css'

GlobalWorkerOptions.workerSrc = workerSrc

interface PdfPreviewProps {
  blob: Blob
}

export function PdfPreview({ blob }: PdfPreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const container = containerRef.current
    const scrollEl = scrollRef.current
    if (!container || !scrollEl) return

    const savedScrollTop = scrollEl.scrollTop

    container.innerHTML = ''
    setError(null)

    blob
      .arrayBuffer()
      .then((buffer) => getDocument({ data: buffer }).promise)
      .then(async (pdf) => {
        const scale = 2 * (window.devicePixelRatio || 1)

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          if (cancelled) return
          const page = await pdf.getPage(pageNumber)
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          canvas.className = 'pdf-preview__page'
          canvas.width = viewport.width
          canvas.height = viewport.height
          const context = canvas.getContext('2d')
          if (!context) continue
          container.appendChild(canvas)
          await page.render({ canvas, canvasContext: context, viewport }).promise
          scrollEl.scrollTop = savedScrollTop
        }
      })
      .catch(() => {
        if (!cancelled) setError('Не удалось отобразить PDF')
      })

    return () => {
      cancelled = true
    }
  }, [blob])

  return (
    <div className="pdf-preview" ref={scrollRef}>
      {error && <p className="pdf-preview__error">{error}</p>}
      <div className="pdf-preview__pages" ref={containerRef} />
    </div>
  )
}
