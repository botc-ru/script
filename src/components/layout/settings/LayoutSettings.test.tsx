import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { PrintSettings } from '../../../types/PrintSettings'
import { DEFAULT_PRINT_SETTINGS } from '../../../utils/defaultPrintSettings'
import { LayoutSettings } from './LayoutSettings'

function renderSettings(settings: Partial<PrintSettings> = {}, onDownloadPdf?: () => void) {
  const onChange = vi.fn()
  render(
    <LayoutSettings
      settings={{ ...DEFAULT_PRINT_SETTINGS, ...settings }}
      onChange={onChange}
      onDownloadPdf={onDownloadPdf}
    />,
  )
  return onChange
}

function isFolded(element: HTMLElement) {
  return element.closest('.layout-settings__sheet-fold--closed[inert]') !== null
}

describe('LayoutSettings', () => {
  it.each<[string, Partial<PrintSettings>]>([
    ['Фон', { background: false }],
    ['Логотип', { logo: false }],
    ['Список ролей', { playerSheet: false }],
    ['Растянуть', { stretch: false }],
    ['Лист рассказчика', { storytellerSheet: false }],
    ['Странники', { travellers: false }],
    ['Таблица', { playersTable: false }],
    ['Порядок ночи', { nightOrderColumns: false }],
    ['Подробная ночь', { nightOrder: false }],
    ['Подсказки', { nightHints: false }],
  ])('переключатель %s меняет только свою настройку', async (name, patch) => {
    const onChange = renderSettings()

    await userEvent.click(screen.getByRole('button', { name, pressed: true }))

    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_PRINT_SETTINGS, ...patch })
  })

  // Номер нужен, когда группы с одним названием есть у нескольких листов
  it.each<[string, number, string, Partial<PrintSettings>]>([
    ['Шрифт', 0, 'L', { fontScale: 1.15 }],
    ['Игроков', 0, '5-6', { playersCount: '5-6' }],
    ['Колонки', 0, '1', { columns: 1 }],
    ['Колонки', 1, '2', { storytellerColumns: 2 }],
  ])('%s №%i: вариант %s меняет настройку', async (group, index, name, patch) => {
    const onChange = renderSettings()
    const groupElement = screen.getAllByRole('group', { name: group })[index]
    if (!groupElement) throw new Error(`нет группы ${group} №${index}`)

    await userEvent.click(within(groupElement).getByRole('button', { name, pressed: false }))

    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_PRINT_SETTINGS, ...patch })
  })

  it('сворачивает настройки выключенного листа', () => {
    renderSettings({ playerSheet: false, nightOrder: false })

    expect(isFolded(screen.getByRole('button', { name: 'Растянуть' }))).toBe(true)
    const [playerColumns, storytellerColumns] = screen.getAllByRole('group', { name: 'Колонки' })
    expect(isFolded(playerColumns ?? document.body)).toBe(true)
    expect(isFolded(storytellerColumns ?? document.body)).toBe(false)
    expect(isFolded(screen.getByRole('button', { name: 'Подсказки' }))).toBe(true)
    expect(isFolded(screen.getByRole('button', { name: 'Таблица' }))).toBe(false)
    expect(isFolded(screen.getByRole('button', { name: 'Список ролей', pressed: false })))
      .toBe(false)
  })

  it('состояние переключателя видно не только по цвету', () => {
    renderSettings({ logo: false })

    expect(screen.getByRole('button', { name: 'Фон' }).querySelector('svg')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Логотип' }).querySelector('svg')).toBeNull()
  })

  it('скачивает PDF', async () => {
    const onDownloadPdf = vi.fn()
    renderSettings({}, onDownloadPdf)

    await userEvent.click(screen.getByRole('button', { name: 'Скачать PDF' }))

    expect(onDownloadPdf).toHaveBeenCalledOnce()
  })

  it('без обработчика скачивание неактивно', () => {
    renderSettings()

    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Скачать PDF' }).disabled)
      .toBe(true)
  })
})
