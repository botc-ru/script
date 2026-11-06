import { describe, expect, it } from 'vitest'

import { DEFAULT_SCRIPT } from './defaultScript'
import { loadScript, saveScript } from './scriptStorage'

describe('scriptStorage', () => {
  it('без сохранения возвращает null', () => {
    expect(loadScript()).toBeNull()
  })

  it('возвращает сохранённый сценарий', () => {
    const script = { ...DEFAULT_SCRIPT, name: 'Тест', roleIds: ['a'], customOrder: true }

    saveScript(script)

    expect(loadScript()).toEqual(script)
  })

  it('заменяет повреждённые поля значениями по умолчанию', () => {
    localStorage.setItem('botc-script', JSON.stringify({ name: 1, roleIds: 'a' }))

    expect(loadScript()).toEqual(DEFAULT_SCRIPT)
  })

  it('при битом JSON возвращает null', () => {
    localStorage.setItem('botc-script', 'oops')

    expect(loadScript()).toBeNull()
  })
})
