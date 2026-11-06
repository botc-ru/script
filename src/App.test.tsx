import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from './App'
import { RolesProvider } from './contexts/roles/RolesProvider'
import { finishAnimation } from './test/finishAnimation'
import { stubClipboard } from './test/stubClipboard'
import type { RolesById } from './types/RolesById'
import { DEFAULT_PRINT_SETTINGS } from './utils/defaultPrintSettings'
import { DEFAULT_SCRIPT } from './utils/defaultScript'
import { downloadBlob } from './utils/downloadBlob'
import { loadScriptPdf } from './utils/loadScriptPdf'
import { loadPrintSettings, savePrintSettings } from './utils/printSettingsStorage'
import { saveScript } from './utils/scriptStorage'

vi.mock('./components/layout/preview/PdfPreview', () => ({
  PdfPreview: ({ isStale }: { isStale: boolean }) => (
    <p>{isStale ? 'Устаревшее превью' : 'Превью PDF'}</p>
  ),
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
    vi.mocked(downloadBlob).mockClear()
    vi.mocked(loadScriptPdf).mockReset()
    vi.mocked(loadScriptPdf).mockResolvedValue(new Blob(['pdf']))
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
    await userEvent.click(screen.getByRole('button', { name: 'PDF' }))

    await waitFor(() => expect(downloadBlob).toHaveBeenCalledWith('Буря.pdf', blob))
  })

  it('скачивает готовый PDF без повторного создания', async () => {
    const blob = new Blob(['pdf'])
    vi.mocked(loadScriptPdf).mockResolvedValue(blob)
    await renderEditor()
    await screen.findByText('Превью PDF')

    await userEvent.click(screen.getByRole('button', { name: 'Поделиться' }))
    await userEvent.click(screen.getByRole('button', { name: 'PDF' }))

    expect(downloadBlob).toHaveBeenCalledWith('Сценарий.pdf', blob)
    expect(loadScriptPdf).toHaveBeenCalledOnce()
  })

  it('после правки создаёт PDF заново', async () => {
    await renderEditor()
    await screen.findByText('Превью PDF')

    await userEvent.click(screen.getByRole('button', { name: /Принцесса/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Поделиться' }))
    await userEvent.click(screen.getByRole('button', { name: 'PDF' }))

    expect(screen.getByText('Создаём PDF...')).toBeDefined()
    await waitFor(() => expect(loadScriptPdf).toHaveBeenCalledTimes(2))
  })

  it('создаёт PDF заранее: Макет открывается без ожидания', async () => {
    await renderEditor()
    await screen.findByText('Превью PDF')

    await userEvent.click(screen.getByRole('button', { name: 'Макет' }))

    expect(screen.queryByText('Создаём PDF...')).toBeNull()
    expect(loadScriptPdf).toHaveBeenCalledOnce()
  })

  it('адрес с action=pdf скачивает PDF после загрузки ролей', async () => {
    window.history.replaceState(null, '', '/script/?action=pdf&roles=princess')
    const blob = new Blob(['pdf'])
    vi.mocked(loadScriptPdf).mockResolvedValue(blob)

    await renderEditor()

    await waitFor(() => expect(downloadBlob).toHaveBeenCalledWith('Сценарий.pdf', blob))
  })

  it('адрес с action=json копирует JSON', async () => {
    window.history.replaceState(null, '', '/script/?action=json&title=Буря&roles=princess')
    const writeText = vi.fn(() => Promise.resolve())
    stubClipboard({ writeText })

    await renderEditor()

    await waitFor(() => expect(writeText).toHaveBeenCalledOnce())
    expect(screen.getByText('JSON скопирован')).toBeDefined()
  })

  it('сообщает об ошибке создания PDF', async () => {
    vi.mocked(loadScriptPdf).mockRejectedValue(new Error('Нет шрифта'))
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: 'Поделиться' }))
    await userEvent.click(screen.getByRole('button', { name: 'PDF' }))

    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toBe('Не удалось создать PDF')
    })
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

    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'PDF' }).disabled).toBe(true)
  })

  it('превью устарело, пока новый PDF не готов, а при ошибке перестаёт быть устаревшим', async () => {
    await renderEditor()
    await userEvent.click(screen.getByRole('button', { name: 'Макет' }))
    await screen.findByText('Превью PDF')

    let finish: (blob: Blob) => void = () => undefined
    vi.mocked(loadScriptPdf).mockReturnValueOnce(new Promise((resolve) => {
      finish = resolve
    }))
    await userEvent.click(screen.getByRole('button', { name: 'Фон' }))
    expect(await screen.findByText('Устаревшее превью')).toBeDefined()

    await waitFor(() => expect(loadScriptPdf).toHaveBeenCalledTimes(2))
    finish(new Blob(['новый']))
    expect(await screen.findByText('Превью PDF')).toBeDefined()

    vi.mocked(loadScriptPdf).mockRejectedValueOnce(new Error('Нет шрифта'))
    await userEvent.click(screen.getByRole('button', { name: 'Логотип' }))
    expect(await screen.findByText('Устаревшее превью')).toBeDefined()
    expect(await screen.findByText('Превью PDF')).toBeDefined()
  })

  it('меняет экран с анимацией, а смена режима на том же экране её не запускает', async () => {
    const startViewTransition = vi.fn((update: () => void) => {
      update()
    })
    Object.assign(document, { startViewTransition })
    await renderEditor()
    expect(startViewTransition).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'Макет' }))

    expect(startViewTransition).toHaveBeenCalledOnce()
    expect(screen.queryByText('Принцесса')).toBeNull()
    Reflect.deleteProperty(document, 'startViewTransition')
  })

  it('Макет показывает превью вместо сценария, возврат показывает сценарий', async () => {
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: 'Макет' }))

    expect(screen.getByRole('button', { name: 'Скачать PDF' })).toBeDefined()
    expect(screen.queryByText('Принцесса')).toBeNull()

    await userEvent.click(screen.getAllByRole('button', { name: 'Макет' })[0] ?? document.body)
    expect(screen.getByText('Принцесса')).toBeDefined()
  })

  it('настройки макета сохраняются', async () => {
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
    await userEvent.click(screen.getByRole('button', { name: 'Вставить' }))

    expect(await screen.findByDisplayValue('Новый')).toBeDefined()
    expect(screen.getByRole('status').textContent).toBe('Сценарий загружен')
    expect(screen.getByRole('heading', { name: 'Изгои (1)' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Отменить' })).toBeNull()
  })

  describe('порядок ролей из ссылки', () => {
    const SORTED_ROLES: RolesById = {
      late: { id: 'late', name: 'Поздний', ability: 'Каждый день', image: '', team: 'townsfolk' },
      early: {
        id: 'early',
        name: 'Ранний',
        ability: 'В первую ночь узнаёт',
        image: '',
        team: 'townsfolk',
      },
    }

    async function getOpenedNames(url: string) {
      window.history.replaceState(null, '', url)
      vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(Response.json(SORTED_ROLES))))
      render(
        <RolesProvider>
          <App />
        </RolesProvider>,
      )
      await screen.findByText('Ранний')
      return Array.from(document.querySelectorAll('.role-card__name'), (name) => name.textContent)
    }

    it('без customOrder роли сортируются при открытии', async () => {
      expect(await getOpenedNames('/script/?roles=late,early')).toEqual(['Ранний', 'Поздний'])
    })

    it('сортировка важнее порядка, сохранённого раньше', async () => {
      saveScript({ ...DEFAULT_SCRIPT, roleIds: ['late'], customOrder: true })

      expect(await getOpenedNames('/script/?roles=late,early')).toEqual(['Ранний', 'Поздний'])
    })

    it('с customOrder порядок из ссылки сохраняется', async () => {
      expect(await getOpenedNames('/script/?roles=late,early&customOrder=true'))
        .toEqual(['Поздний', 'Ранний'])
    })
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
