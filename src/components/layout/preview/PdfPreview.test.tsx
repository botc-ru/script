import { render, screen, waitFor } from '@testing-library/react'
import { getDocument, type PDFDocumentLoadingTask } from 'pdfjs-dist'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PdfPreview } from './PdfPreview'

vi.mock('pdfjs-dist', () => ({ getDocument: vi.fn(), GlobalWorkerOptions: {} }))
vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({ default: 'worker.mjs' }))

function stubDocument(pages: number, renderPage: () => Promise<void> = () => Promise.resolve()) {
  const destroy = vi.fn(() => Promise.resolve())
  const page = {
    getViewport: ({ scale }: { scale: number }) => ({ width: 100 * scale, height: 141 * scale }),
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

function isBusy() {
  return document.querySelector('.pdf-preview')?.getAttribute('aria-busy') === 'true'
}

describe('PdfPreview', () => {
  beforeEach(() => {
    vi.mocked(getDocument).mockReset()
    window.matchMedia = vi.fn(() => ({ matches: false }) as MediaQueryList)
  })

  it('рисует все страницы', async () => {
    stubDocument(3)

    render(<PdfPreview blob={new Blob(['1'])} isStale={false} />)

    await waitFor(() => expect(getPages()).toHaveLength(3))
  })

  it('оставляет старые страницы, пока новые не готовы, и заменяет их разом', async () => {
    stubDocument(3)
    const { rerender } = render(<PdfPreview blob={new Blob(['1'])} isStale={false} />)
    await waitFor(() => expect(getPages()).toHaveLength(3))

    let finishPage: () => void = () => undefined
    stubDocument(1, () => new Promise((resolve) => {
      finishPage = resolve
    }))
    rerender(<PdfPreview blob={new Blob(['2'])} isStale={false} />)
    await waitFor(() => expect(getDocument).toHaveBeenCalledTimes(2))
    expect(getPages()).toHaveLength(3)

    finishPage()
    await waitFor(() => expect(getPages()).toHaveLength(1))
  })

  it('затемнено, пока PDF создаётся и пока рисуются новые страницы', async () => {
    const first = new Blob(['1'])
    stubDocument(2)
    const { rerender } = render(<PdfPreview blob={first} isStale={false} />)
    await waitFor(() => expect(getPages()).toHaveLength(2))
    await waitFor(() => expect(isBusy()).toBe(false))

    rerender(<PdfPreview blob={first} isStale />)
    expect(isBusy()).toBe(true)

    let finishPage: () => void = () => undefined
    stubDocument(1, () => new Promise((resolve) => {
      finishPage = resolve
    }))
    rerender(<PdfPreview blob={new Blob(['2'])} isStale={false} />)
    expect(isBusy()).toBe(true)

    await waitFor(() => expect(getDocument).toHaveBeenCalledTimes(2))
    finishPage()
    await waitFor(() => expect(getPages()).toHaveLength(1))
    await waitFor(() => expect(isBusy()).toBe(false))
  })

  it('отбрасывает устаревшую отрисовку и закрывает её документ', async () => {
    let finishPage: () => void = () => undefined
    const destroyFirst = stubDocument(1, () => new Promise((resolve) => {
      finishPage = resolve
    }))
    const { rerender } = render(<PdfPreview blob={new Blob(['1'])} isStale={false} />)
    await waitFor(() => expect(getDocument).toHaveBeenCalledOnce())

    stubDocument(2)
    rerender(<PdfPreview blob={new Blob(['2'])} isStale={false} />)
    await waitFor(() => expect(getPages()).toHaveLength(2))
    expect(destroyFirst).toHaveBeenCalledOnce()

    finishPage()
    await new Promise((resolve) => {
      setTimeout(resolve)
    })
    expect(getPages()).toHaveLength(2)
  })

  it.each([
    ['на ПК рисует страницы по ширине экрана', false, 200],
    ['на сенсорном экране рисует с запасом для увеличения', true, 300],
  ])('%s', async (_, isTouch, width) => {
    window.matchMedia = vi.fn(() => ({ matches: isTouch }) as MediaQueryList)
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100)
    vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(2)
    stubDocument(1)

    render(<PdfPreview blob={new Blob(['1'])} isStale={false} />)

    await waitFor(() => expect(getPages()).toHaveLength(1))
    expect((getPages()[0] as HTMLCanvasElement).width).toBe(width)
    vi.restoreAllMocks()
  })

  it('закрывает документ сразу после отрисовки', async () => {
    const destroy = stubDocument(2)

    render(<PdfPreview blob={new Blob(['1'])} isStale={false} />)

    await waitFor(() => expect(getPages()).toHaveLength(2))
    await waitFor(() => expect(destroy).toHaveBeenCalledOnce())
  })

  it('освобождает память заменённых и убранных страниц', async () => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100)
    stubDocument(2)
    const { rerender, unmount } = render(<PdfPreview blob={new Blob(['1'])} isStale={false} />)
    await waitFor(() => expect(getPages()).toHaveLength(2))
    const oldPages = [...getPages()] as HTMLCanvasElement[]

    stubDocument(1)
    rerender(<PdfPreview blob={new Blob(['2'])} isStale={false} />)
    await waitFor(() => expect(getPages()).toHaveLength(1))
    const [newPage] = getPages() as NodeListOf<HTMLCanvasElement>

    expect(oldPages.map((page) => page.width)).toEqual([0, 0])
    expect(newPage?.width).toBeGreaterThan(0)
    unmount()
    expect(newPage?.width).toBe(0)
    vi.restoreAllMocks()
  })

  it('сообщает об ошибке', async () => {
    vi.mocked(getDocument).mockReturnValueOnce({
      promise: Promise.reject(new Error('Сбой')),
      destroy: () => Promise.resolve(),
    } as unknown as PDFDocumentLoadingTask)

    render(<PdfPreview blob={new Blob(['1'])} isStale={false} />)

    expect(await screen.findByText('Не удалось показать PDF')).toBeDefined()
    expect(isBusy()).toBe(false)
  })
})
