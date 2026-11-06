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
  ])('переключатель %s меняет только свою настройку', async (name, patch) => {
    const onChange = renderSettings()

    await userEvent.click(screen.getByRole('button', { name, pressed: true }))

    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_PRINT_SETTINGS, ...patch })
  })

  it.each<[string, string, Partial<PrintSettings>]>([
    ['Шрифт', 'L', { fontScale: 1.15 }],
    ['Игроков', '5-6', { playersCount: '5-6' }],
    ['Колонки', '1', { columns: 1 }],
  ])('%s: вариант %s меняет настройку', async (group, name, patch) => {
    const onChange = renderSettings()

    await userEvent.click(within(screen.getByRole('group', { name: group })).getByRole('button', {
      name,
      pressed: false,
    }))

    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_PRINT_SETTINGS, ...patch })
  })

  it('скрывает настройки выключенного листа', () => {
    renderSettings({ playerSheet: false, storytellerSheet: false })

    expect(screen.queryByRole('button', { name: 'Растянуть' })).toBeNull()
    expect(screen.queryByRole('group', { name: 'Колонки' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Таблица' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Список ролей', pressed: false })).toBeDefined()
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
