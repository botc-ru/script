import { describe, expect, it } from 'vitest'

import { parseScriptText } from './parseScriptText'

describe('parseScriptText', () => {
  it('читает ссылку на сценарий', () => {
    const script = parseScriptText('  https://botc-ru.github.io/script/?title=Буря&roles=a,b\n')

    expect(script).toMatchObject({ name: 'Буря', roleIds: ['a', 'b'] })
  })

  it('читает JSON', () => {
    expect(parseScriptText('["a"]')?.roleIds).toEqual(['a'])
  })

  it('не распознаёт обычный текст и ссылку без сценария', () => {
    expect(parseScriptText('привет')).toBeNull()
    expect(parseScriptText('https://botc-ru.github.io/script/')).toBeNull()
  })
})
