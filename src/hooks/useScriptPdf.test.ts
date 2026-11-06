import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { RolesState } from '../contexts/roles/RolesState'
import { TEST_ROLES } from '../test/testRoles'
import { DEFAULT_PRINT_SETTINGS } from '../utils/defaultPrintSettings'
import { DEFAULT_SCRIPT } from '../utils/defaultScript'
import { loadScriptPdf } from '../utils/loadScriptPdf'
import { useScriptPdf } from './useScriptPdf'

vi.mock('../utils/loadScriptPdf')

const READY: RolesState = { status: 'ready', roles: TEST_ROLES }
const FIRST = new Blob(['1'])
const SECOND = new Blob(['2'])

interface Props {
  settings?: typeof DEFAULT_PRINT_SETTINGS
  roles?: RolesState
  isActive?: boolean
}

function renderPdf(initialProps: Props = {}) {
  return renderHook(
    ({ settings = DEFAULT_PRINT_SETTINGS, roles = READY, isActive = true }: Props) => (
      useScriptPdf(DEFAULT_SCRIPT, roles, settings, isActive)
    ),
    { initialProps },
  )
}

async function wait(ms: number) {
  await act(() => new Promise((resolve) => {
    setTimeout(resolve, ms)
  }))
}

describe('useScriptPdf', () => {
  beforeEach(() => {
    vi.mocked(loadScriptPdf).mockReset()
    vi.mocked(loadScriptPdf).mockResolvedValue(FIRST)
  })

  it('создаёт PDF с данными сценария', async () => {
    const { result } = renderPdf()

    await waitFor(() => expect(result.current.blob).toBe(FIRST))
    expect(loadScriptPdf).toHaveBeenCalledWith({
      script: DEFAULT_SCRIPT,
      roles: TEST_ROLES,
      settings: DEFAULT_PRINT_SETTINGS,
    })
  })

  it.each<[string, Props]>([
    ['роли не загружены', { roles: { status: 'loading' } }],
    ['все листы выключены', {
      settings: {
        ...DEFAULT_PRINT_SETTINGS,
        playerSheet: false,
        storytellerSheet: false,
        nightOrder: false,
      },
    }],
  ])('не создаёт PDF, если %s', async (_, props) => {
    renderPdf(props)

    await wait(250)

    expect(loadScriptPdf).not.toHaveBeenCalled()
  })

  it('первый раз создаёт PDF и на закрытом экране', async () => {
    const { result } = renderPdf({ isActive: false })

    await waitFor(() => expect(result.current.blob).toBe(FIRST))
    expect(result.current.isFresh).toBe(true)
  })

  it('на закрытом экране не обновляет PDF при правках', async () => {
    const { result, rerender } = renderPdf({ isActive: false })
    await waitFor(() => expect(result.current.blob).toBe(FIRST))

    rerender({ isActive: false, settings: { ...DEFAULT_PRINT_SETTINGS, logo: false } })
    await wait(250)

    expect(loadScriptPdf).toHaveBeenCalledOnce()
    expect(result.current.isFresh).toBe(false)
  })

  it('при открытии экрана подхватывает правки', async () => {
    const settings = { ...DEFAULT_PRINT_SETTINGS, logo: false }
    const { result, rerender } = renderPdf({ isActive: false })
    await waitFor(() => expect(result.current.blob).toBe(FIRST))

    vi.mocked(loadScriptPdf).mockResolvedValue(SECOND)
    rerender({ isActive: false, settings })
    rerender({ isActive: true, settings })

    await waitFor(() => expect(result.current.blob).toBe(SECOND))
    expect(result.current.isFresh).toBe(true)
  })

  it('при открытии экрана без правок не создаёт PDF заново', async () => {
    const { result, rerender } = renderPdf({ isActive: false })
    await waitFor(() => expect(result.current.blob).toBe(FIRST))

    rerender({ isActive: true })
    await wait(250)

    expect(loadScriptPdf).toHaveBeenCalledOnce()
  })

  it('быстрые изменения настроек дают один запуск', async () => {
    const { result, rerender } = renderPdf()

    rerender({ settings: { ...DEFAULT_PRINT_SETTINGS, logo: false } })
    rerender({ settings: { ...DEFAULT_PRINT_SETTINGS, background: false } })

    await waitFor(() => expect(result.current.blob).toBe(FIRST))
    expect(loadScriptPdf).toHaveBeenCalledOnce()
  })

  it('отбрасывает устаревший результат', async () => {
    let finishFirst: (blob: Blob) => void = () => undefined
    vi.mocked(loadScriptPdf)
      .mockReturnValueOnce(new Promise((resolve) => {
        finishFirst = resolve
      }))
      .mockResolvedValueOnce(SECOND)
    const { result, rerender } = renderPdf()
    await waitFor(() => expect(loadScriptPdf).toHaveBeenCalledOnce())

    rerender({ settings: { ...DEFAULT_PRINT_SETTINGS, logo: false } })
    await waitFor(() => expect(result.current.blob).toBe(SECOND))
    await act(async () => {
      finishFirst(FIRST)
      await Promise.resolve()
    })

    expect(result.current.blob).toBe(SECOND)
  })

  it('при ошибке сообщает о ней и сохраняет прошлый результат', async () => {
    const { result, rerender } = renderPdf()
    await waitFor(() => expect(result.current.blob).toBe(FIRST))

    vi.mocked(loadScriptPdf).mockRejectedValue(new Error('Сбой'))
    rerender({ settings: { ...DEFAULT_PRINT_SETTINGS, logo: false } })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.blob).toBe(FIRST)
  })
})
