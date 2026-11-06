import { render, screen, waitFor } from '@testing-library/react'
import { getDocument, type PDFDocumentLoadingTask } from 'pdfjs-dist'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PdfPreview } from './PdfPreview'

vi.mock('pdfjs-dist', () => ({ getDocument: vi.fn(), GlobalWorkerOptions: {} }))
vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({ default: 'worker.mjs' }))

function stubDocument(pages: number, renderPage: () => Promise<void> = () => Promise.resolve()) {
  const destroy = vi.fn(() => Promise.resolve())
  const page = {
    getViewport: () => ({ width: 100, height: 141 }),
    render: () => ({ promise: renderPage() }),
  }
  const task = {
    promise: Promise.resolve({ numPages: pages, getPage: () => Promise.resolve(page) }),
    destroy,
  }
  vi.mocked(getDocument).mockReturnValueOnce(task as unknown as PDFDocumentLoadingTask)
  return destroy
}

function getPages() {
  return document.querySelectorAll('.pdf-preview__page')
}

describe('PdfPreview', () => {
  beforeEach(() => {
    vi.mocked(getDocument).mockReset()
  })

  it('рисует все страницы', async () => {
    stubDocument(3)

    render(<PdfPreview blob={new Blob(['1'])} />)

    await waitFor(() => expect(getPages()).toHaveLength(3))
  })

  it('оставляет старые страницы, пока новые не готовы, и заменяет их разом', async () => {
    stubDocument(3)
    const { rerender } = render(<PdfPreview blob={new Blob(['1'])} />)
    await waitFor(() => expect(getPages()).toHaveLength(3))

    let finishPage: () => void = () => undefined
    stubDocument(1, () => new Promise((resolve) => {
      finishPage = resolve
    }))
    rerender(<PdfPreview blob={new Blob(['2'])} />)
    await waitFor(() => expect(getDocument).toHaveBeenCalledTimes(2))
    expect(getPages()).toHaveLength(3)

    finishPage()
    await waitFor(() => expect(getPages()).toHaveLength(1))
  })

  it('отбрасывает устаревшую отрисовку и закрывает её документ', async () => {
    let finishPage: () => void = () => undefined
    const destroyFirst = stubDocument(1, () => new Promise((resolve) => {
      finishPage = resolve
    }))
    const { rerender } = render(<PdfPreview blob={new Blob(['1'])} />)
    await waitFor(() => expect(getDocument).toHaveBeenCalledOnce())

    stubDocument(2)
    rerender(<PdfPreview blob={new Blob(['2'])} />)
    await waitFor(() => expect(getPages()).toHaveLength(2))
    expect(destroyFirst).toHaveBeenCalledOnce()

    finishPage()
    await new Promise((resolve) => {
      setTimeout(resolve)
    })
    expect(getPages()).toHaveLength(2)
  })

  it('сообщает об ошибке', async () => {
    vi.mocked(getDocument).mockReturnValueOnce({
      promise: Promise.reject(new Error('Сбой')),
      destroy: () => Promise.resolve(),
    } as unknown as PDFDocumentLoadingTask)

    render(<PdfPreview blob={new Blob(['1'])} />)

    expect(await screen.findByText('Не удалось показать PDF')).toBeDefined()
  })
})
