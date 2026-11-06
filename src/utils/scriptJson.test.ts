import { describe, expect, it } from 'vitest'

import type { ScriptData } from '../types/ScriptData'
import { DEFAULT_SCRIPT } from './defaultScript'
import { buildScriptJson, parseScriptJson } from './scriptJson'

const SCRIPT: ScriptData = {
  name: 'Буря',
  author: 'Автор',
  color: '#123456',
  roleIds: ['a', 'b'],
  customOrder: true,
}

describe('scriptJson', () => {
  it('сохраняет все поля сценария при экспорте и импорте', () => {
    expect(parseScriptJson(buildScriptJson(SCRIPT))).toEqual(SCRIPT)
  })

  it('читает формат официального инструмента с объектами ролей', () => {
    const text = JSON.stringify([{ id: '_meta', name: 'Тест' }, { id: 'a' }, 'b'])

    expect(parseScriptJson(text)).toEqual({ ...DEFAULT_SCRIPT, name: 'Тест', roleIds: ['a', 'b'] })
  })

  it('читает сценарий без _meta и убирает повторы', () => {
    expect(parseScriptJson('["a", "a", "b"]')?.roleIds).toEqual(['a', 'b'])
  })

  it('пропускает записи без id', () => {
    expect(parseScriptJson('["a", {}, 1, null]')?.roleIds).toEqual(['a'])
  })

  it('возвращает null для неверного JSON и не массива', () => {
    expect(parseScriptJson('oops')).toBeNull()
    expect(parseScriptJson('{"id": "a"}')).toBeNull()
  })
})
