import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from './App'
import { RolesProvider } from './contexts/roles/RolesProvider'
import { finishAnimation } from './test/finishAnimation'
import { stubClipboard } from './test/stubClipboard'
import type { RolesById } from './types/RolesById'
import { DEFAULT_PRINT_SETTINGS } from './utils/defaultPrintSettings'
import { downloadBlob } from './utils/downloadBlob'
import { loadScriptPdf } from './utils/loadScriptPdf'
import { loadPrintSettings, savePrintSettings } from './utils/printSettingsStorage'

vi.mock('./components/layout/preview/PdfPreview', () => ({
  PdfPreview: () => <p>Превью PDF</p>,
}))
vi.mock('./utils/loadScriptPdf')
vi.mock('./utils/downloadBlob')

const ROLES: RolesById = {
  princess: { id: 'princess', name: 'Принцесса', ability: '', image: '', team: 'townsfolk' },
  goon: { id: 'goon', name: 'Громила', ability: '', image: '', team: 'outsider' },
}

async function renderEditor() {
  render(
    <RolesProvider>
      <App />
    </RolesProvider>,
  )
  await screen.findByText('Принцесса')
  await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }))
}

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/script/?roles=princess,goon')
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(Response.json(ROLES))))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('отменяет и повторяет удаление роли', async () => {
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: /Принцесса/ }))
    expect(screen.queryByText('Принцесса')).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'Отменить' }))
    expect(screen.getByText('Принцесса')).toBeDefined()

    await userEvent.click(screen.getByRole('button', { name: 'Повторить' }))
    expect(screen.queryByText('Принцесса')).toBeNull()
  })

  it('добавляет и удаляет роль через поиск', async () => {
    window.history.replaceState(null, '', '/script/?roles=princess')
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: 'Поиск' }))
    await userEvent.type(screen.getByRole('searchbox'), 'гром')
    await userEvent.click(screen.getByRole('button', { name: 'Громила', pressed: false }))
    expect(screen.getByRole('heading', { name: 'Изгои (1)' })).toBeDefined()

    finishAnimation(screen.getByRole('searchbox').parentElement ?? document.body)
    await userEvent.click(screen.getByRole('button', { name: 'Поиск' }))
    await userEvent.type(screen.getByRole('searchbox'), 'гром')
    await userEvent.click(screen.getByRole('button', { name: 'Громила', pressed: true }))
    expect(screen.getByRole('heading', { name: 'Изгои (0)' })).toBeDefined()
  })

  it('панель ролей добавляет роль и остаётся открытой', async () => {
    window.history.replaceState(null, '', '/script/?roles=princess')
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: 'Роли' }))
    await userEvent.click(screen.getByRole('button', { name: 'Громила', pressed: false }))

    expect(screen.getByRole('heading', { name: 'Изгои (1)' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Громила', pressed: true })).toBeDefined()
  })

  it('клик по заголовку секции открывает роли с фильтром по команде', async () => {
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: 'Изгои (1)' }))
    expect(screen.getByRole('button', { name: 'Изгои', pressed: true })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Громила', pressed: true })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Принцесса', pressed: true })).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'Горожане (1)' }))
    expect(screen.getByRole('button', { name: 'Горожане', pressed: true })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Принцесса', pressed: true })).toBeDefined()
  })

  it('закрытие панели ролей сбрасывает фильтр', async () => {
    await renderEditor()
    const rolesButton = screen.getByRole('button', { name: 'Роли' })

    await userEvent.click(screen.getByRole('button', { name: 'Изгои (1)' }))
    await userEvent.click(rolesButton)
    await userEvent.click(rolesButton)

    expect(screen.getByRole('button', { name: 'Все', pressed: true })).toBeDefined()
  })

  it('скачивает PDF с названием сценария', async () => {
    window.history.replaceState(null, '', '/script/?title=Буря&roles=princess')
    const blob = new Blob(['pdf'])
    vi.mocked(loadScriptPdf).mockResolvedValue(blob)
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: 'Поделиться' }))
    await userEvent.click(screen.getByRole('button', { name: 'Скачать PDF' }))

    expect(screen.getByText('Создаём PDF...')).toBeDefined()
    await waitFor(() => expect(downloadBlob).toHaveBeenCalledWith('Буря.pdf', blob))
  })

  it('сообщает об ошибке создания PDF', async () => {
    vi.mocked(loadScriptPdf).mockRejectedValue(new Error('Нет шрифта'))
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: 'Поделиться' }))
    await userEvent.click(screen.getByRole('button', { name: 'Скачать PDF' }))

    expect(await screen.findByText('Не удалось создать PDF')).toBeDefined()
  })

  it('без включённых листов скачивание PDF неактивно', async () => {
    savePrintSettings({
      ...DEFAULT_PRINT_SETTINGS,
      playerSheet: false,
      storytellerSheet: false,
      nightOrder: false,
    })
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: 'Поделиться' }))

    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Скачать PDF' }).disabled)
      .toBe(true)
  })

  it('Макет показывает превью вместо сценария, возврат показывает сценарий', async () => {
    vi.mocked(loadScriptPdf).mockResolvedValue(new Blob(['pdf']))
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: 'Макет' }))

    expect(screen.getByText('Создаём PDF...')).toBeDefined()
    expect(await screen.findByText('Превью PDF')).toBeDefined()
    expect(screen.queryByText('Принцесса')).toBeNull()

    await userEvent.click(screen.getAllByRole('button', { name: 'Макет' })[0] ?? document.body)
    expect(screen.getByText('Принцесса')).toBeDefined()
  })

  it('настройки макета сохраняются', async () => {
    vi.mocked(loadScriptPdf).mockResolvedValue(new Blob(['pdf']))
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: 'Макет' }))
    await userEvent.click(screen.getByRole('button', { name: 'Фон' }))

    expect(loadPrintSettings().background).toBe(false)
  })

  it('без включённых листов Макет просит включить лист', async () => {
    savePrintSettings({
      ...DEFAULT_PRINT_SETTINGS,
      playerSheet: false,
      storytellerSheet: false,
      nightOrder: false,
    })
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: 'Макет' }))

    expect(screen.getByText('Включите хотя бы один лист')).toBeDefined()
  })

  it('возврат в просмотр закрывает панель ролей', async () => {
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: 'Роли' }))
    expect(screen.getByRole('searchbox', { name: 'Поиск по ролям' })).toBeDefined()

    await userEvent.click(screen.getAllByRole('button', { name: 'Просмотр' })[0] ?? document.body)

    expect(screen.queryByRole('searchbox', { name: 'Поиск по ролям' })).toBeNull()
  })

  it('импорт заменяет сценарий, очищает историю и сообщает об этом', async () => {
    stubClipboard({ readText: () => Promise.resolve('[{"id":"_meta","name":"Новый"},"GOON"]') })
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: /Принцесса/ }))
    expect(screen.getByRole('button', { name: 'Отменить' })).toBeDefined()

    await userEvent.click(screen.getByRole('button', { name: 'Поделиться' }))
    await userEvent.click(screen.getByRole('button', { name: 'Из буфера обмена' }))

    expect(await screen.findByDisplayValue('Новый')).toBeDefined()
    expect(screen.getByRole('status').textContent).toBe('Сценарий загружен')
    expect(screen.getByRole('heading', { name: 'Изгои (1)' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Отменить' })).toBeNull()
  })

  it('всегда открывается в режиме просмотра', async () => {
    render(
      <RolesProvider>
        <App />
      </RolesProvider>,
    )
    await screen.findByText('Принцесса')

    expect(screen.getByRole('button', { name: 'Редактировать' })).toBeDefined()
    expect(screen.getByRole('link', { name: /Принцесса/ })).toBeDefined()
  })

  it('не показывает отмену, пока сценарий не менялся', async () => {
    await renderEditor()

    expect(screen.queryByRole('button', { name: 'Отменить' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Повторить' })).toBeNull()
  })

  it('в просмотре клик по роли ничего не удаляет после возврата из редактирования', async () => {
    await renderEditor()

    await userEvent.click(screen.getAllByRole('button', { name: 'Просмотр' })[0] ?? document.body)
    await userEvent.click(screen.getByText('Принцесса'))

    expect(screen.getByText('Принцесса')).toBeDefined()
  })
})
