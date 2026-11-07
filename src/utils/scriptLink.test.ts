import { describe, expect, it } from 'vitest'

import type { ScriptData } from '../types/ScriptData'
import { DEFAULT_SCRIPT } from './defaultScript'
import { buildScriptQuery, readScriptFromLink } from './scriptLink'

describe('readScriptFromLink', () => {
  it('без title и roles это не ссылка', () => {
    expect(readScriptFromLink('')).toBeNull()
    expect(readScriptFromLink('?author=Автор')).toBeNull()
  })

  it('читает все параметры', () => {
    const script = readScriptFromLink('?title=Буря&author=Автор&color=%23123456&roles=a,b')

    expect(script).toEqual({
      name: 'Буря',
      author: 'Автор',
      color: '#123456',
      roleIds: ['a', 'b'],
      customOrder: false,
    })
  })

  it('подставляет значения по умолчанию', () => {
    expect(readScriptFromLink('?roles=a')).toEqual({ ...DEFAULT_SCRIPT, roleIds: ['a'] })
  })

  it('включает customOrder при наличии параметра, даже без значения', () => {
    expect(readScriptFromLink('?roles=a&customOrder')?.customOrder).toBe(true)
    expect(readScriptFromLink('?roles=a&customOrder=true')?.customOrder).toBe(true)
  })

  it('убирает пустые и повторяющиеся роли', () => {
    expect(readScriptFromLink('?roles=a,,b,a,')?.roleIds).toEqual(['a', 'b'])
  })

  it('раскодирует повторно закодированные значения, как в ссылках из Telegram', () => {
    const script = readScriptFromLink('?title=Буря%2520%2526%2520Скверна&author=Автор%2520Имя&roles=a')

    expect(script).toMatchObject({ name: 'Буря & Скверна', author: 'Автор Имя' })
  })

  it('оставляет как есть знак процента, который не раскодируется', () => {
    expect(readScriptFromLink('?title=100%25')?.name).toBe('100%')
  })

  it('поддерживает пустой список ролей', () => {
    expect(readScriptFromLink('?title=Пусто')?.roleIds).toEqual([])
  })
})

describe('buildScriptQuery', () => {
  const script: ScriptData = {
    name: 'Буря & Скверна #1',
    author: 'Автор',
    color: '#123456',
    roleIds: ['a', 'b'],
    customOrder: true,
  }

  it('сохраняет кириллицу читаемой', () => {
    expect(buildScriptQuery(script)).toContain('author=Автор')
  })

  it('не добавляет пустые параметры и выключенный customOrder', () => {
    const query = buildScriptQuery({ ...DEFAULT_SCRIPT, color: '', roleIds: ['a'] })

    expect(query).toBe('roles=a')
  })

  it('прочитанная ссылка совпадает с исходным сценарием', () => {
    expect(readScriptFromLink(`?${buildScriptQuery(script)}`)).toEqual(script)
  })
})
