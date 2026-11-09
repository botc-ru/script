import { beforeEach, describe, expect, it } from 'vitest'

import { DEFAULT_PRINT_SETTINGS } from './defaultPrintSettings'
import { loadPrintSettings, savePrintSettings } from './printSettingsStorage'

describe('printSettingsStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('без сохранения возвращает значения по умолчанию', () => {
    expect(loadPrintSettings()).toEqual(DEFAULT_PRINT_SETTINGS)
  })

  it('читает сохранённые настройки', () => {
    const settings = {
      ...DEFAULT_PRINT_SETTINGS,
      fontScale: 1.15,
      columns: 1,
      storytellerColumns: 2,
      playersCount: '5-6',
      logo: false,
    } as const

    savePrintSettings(settings)

    expect(loadPrintSettings()).toEqual(settings)
  })

  it('заменяет повреждённые поля значениями по умолчанию', () => {
    localStorage.setItem('botc-print-settings', JSON.stringify({
      fontScale: 7,
      columns: 3,
      storytellerColumns: 0,
      playersCount: 'много',
      logo: 'нет',
      background: false,
    }))

    expect(loadPrintSettings()).toEqual({ ...DEFAULT_PRINT_SETTINGS, background: false })
  })

  it('при испорченном JSON возвращает значения по умолчанию', () => {
    localStorage.setItem('botc-print-settings', '{')

    expect(loadPrintSettings()).toEqual(DEFAULT_PRINT_SETTINGS)
  })
})
