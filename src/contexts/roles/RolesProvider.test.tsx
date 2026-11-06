import { render, renderHook, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RolesProvider } from './RolesProvider'
import { useRoles } from './useRoles'

function RolesStatus() {
  return <p>{useRoles().status}</p>
}

function renderRoles() {
  render(
    <RolesProvider>
      <RolesStatus />
    </RolesProvider>,
  )
}

describe('RolesProvider', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('сообщает о загрузке, затем о готовности', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(Response.json({}))))

    renderRoles()

    expect(screen.getByText('loading')).toBeDefined()
    expect(await screen.findByText('ready')).toBeDefined()
  })

  it('ответ с ошибкой считается ошибкой загрузки', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response('', { status: 500 }))))

    renderRoles()

    expect(await screen.findByText('error')).toBeDefined()
  })

  it('сбой сети считается ошибкой загрузки', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Сбой'))))

    renderRoles()

    expect(await screen.findByText('error')).toBeDefined()
  })

  it('useRoles вне провайдера падает с ошибкой', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    expect(() => renderHook(() => useRoles())).toThrow()

    vi.restoreAllMocks()
  })
})
