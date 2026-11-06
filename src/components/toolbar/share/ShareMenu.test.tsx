import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { stubClipboard } from '../../../test/stubClipboard'
import type { ScriptData } from '../../../types/ScriptData'
import { DEFAULT_SCRIPT } from '../../../utils/defaultScript'
import { ShareMenu } from './ShareMenu'

const SCRIPT: ScriptData = { ...DEFAULT_SCRIPT, name: 'Буря', roleIds: ['a'] }

function renderMenu() {
  const onImport = vi.fn()
  const onNotify = vi.fn()
  render(<ShareMenu script={SCRIPT} onImport={onImport} onNotify={onNotify} />)
  return { onImport, onNotify }
}

async function choose(item: string) {
  await userEvent.click(screen.getByRole('button', { name: 'Поделиться' }))
  await userEvent.click(screen.getByRole('button', { name: item }))
}

describe('ShareMenu', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('разделяет импорт и экспорт, PDF пока неактивен', async () => {
    renderMenu()

    await userEvent.click(screen.getByRole('button', { name: 'Поделиться' }))

    expect(screen.getByText('Импорт')).toBeDefined()
    expect(screen.getByText('Экспорт')).toBeDefined()
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Скачать PDF' }).disabled)
      .toBe(true)
  })

  it('импортирует ссылку из буфера обмена', async () => {
    const { onImport } = renderMenu()
    stubClipboard({ readText: () => Promise.resolve('https://a.b/script/?title=Т&roles=x') })

    await choose('Из буфера обмена')

    await waitFor(() => expect(onImport).toHaveBeenCalledOnce())
    expect(onImport.mock.calls[0]?.[0]).toMatchObject({ name: 'Т', roleIds: ['x'] })
  })

  it('импортирует JSON из буфера обмена', async () => {
    const { onImport } = renderMenu()
    stubClipboard({ readText: () => Promise.resolve('["x"]') })

    await choose('Из буфера обмена')

    await waitFor(() => expect(onImport).toHaveBeenCalledOnce())
  })

  it('сообщает, если сценарий не распознан', async () => {
    const { onImport, onNotify } = renderMenu()
    stubClipboard({ readText: () => Promise.resolve('привет') })

    await choose('Из буфера обмена')

    await waitFor(() => expect(onNotify).toHaveBeenCalledWith('Не удалось распознать сценарий'))
    expect(onImport).not.toHaveBeenCalled()
  })

  it('сообщает, если буфер обмена недоступен', async () => {
    const { onNotify } = renderMenu()
    stubClipboard({ readText: () => Promise.reject(new Error('denied')) })

    await choose('Из буфера обмена')

    await waitFor(() => expect(onNotify).toHaveBeenCalledWith('Нет доступа к буферу обмена'))
  })

  it('импортирует файл JSON', async () => {
    const { onImport } = renderMenu()
    const file = new File(['["x"]'], 'script.json', { type: 'application/json' })

    await userEvent.upload(screen.getByLabelText('Файл сценария'), file)

    await waitFor(() => expect(onImport).toHaveBeenCalledOnce())
    expect(onImport.mock.calls[0]?.[0]).toMatchObject({ roleIds: ['x'] })
  })

  it('копирует JSON и сообщает об этом', async () => {
    const { onNotify } = renderMenu()
    const writeText = vi.fn(() => Promise.resolve())
    stubClipboard({ writeText })

    await choose('Копировать JSON')

    await waitFor(() => expect(onNotify).toHaveBeenCalledWith('JSON скопирован'))
    expect(writeText.mock.calls[0]).toBeDefined()
  })

  it('копирует ссылку с параметрами сценария', async () => {
    const { onNotify } = renderMenu()
    const writeText = vi.fn<(text: string) => Promise<void>>(() => Promise.resolve())
    stubClipboard({ writeText })

    await choose('Копировать ссылку')

    await waitFor(() => expect(onNotify).toHaveBeenCalledWith('Ссылка скопирована'))
    expect(writeText.mock.calls[0]?.[0]).toContain('?title=Буря')
  })

  it('показывает текст для ручного копирования, если буфер недоступен', async () => {
    const { onNotify } = renderMenu()
    const prompt = vi.spyOn(window, 'prompt').mockReturnValue(null)
    stubClipboard({ writeText: () => Promise.reject(new Error('denied')) })

    await choose('Копировать ссылку')

    await waitFor(() => expect(prompt).toHaveBeenCalledOnce())
    expect(onNotify).not.toHaveBeenCalled()
  })

  it('скачивает JSON с названием сценария', async () => {
    renderMenu()
    const createUrl = vi.fn(() => 'blob:script')
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: createUrl, revokeObjectURL: vi.fn() }))
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    await choose('Скачать JSON')

    expect(createUrl).toHaveBeenCalledOnce()
    expect((click.mock.contexts[0] as HTMLAnchorElement).download).toBe('Буря.json')
    vi.unstubAllGlobals()
  })
})
