import { useEffect, useRef, useState } from 'react'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import './PdfPreview.css'

GlobalWorkerOptions.workerSrc = workerSrc

interface PdfPreviewProps {
  blob: Blob
}

export function PdfPreview({ blob }: PdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const container = containerRef.current
    if (!container) return

    container.innerHTML = ''
    setError(null)

    blob
      .arrayBuffer()
      .then((buffer) => getDocument({ data: buffer }).promise)
      .then(async (pdf) => {
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          if (cancelled) return
          const page = await pdf.getPage(pageNumber)
          const scale = 3 * (window.devicePixelRatio || 1)
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          canvas.className = 'pdf-preview__page'
          canvas.width = viewport.width
          canvas.height = viewport.height
          const context = canvas.getContext('2d')
          if (!context) continue
          container.appendChild(canvas)
          await page.render({ canvas, canvasContext: context, viewport }).promise
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
    <div className="pdf-preview">
      {error && <p className="pdf-preview__error">{error}</p>}
      <div className="pdf-preview__pages" ref={containerRef} />
    </div>
  )
}
