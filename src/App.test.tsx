import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from './App'
import { RolesProvider } from './contexts/roles/RolesProvider'
import { finishAnimation } from './test/finishAnimation'
import type { RolesById } from './types/RolesById'

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

  it('возврат в просмотр закрывает панель ролей', async () => {
    await renderEditor()

    await userEvent.click(screen.getByRole('button', { name: 'Роли' }))
    expect(screen.getByRole('searchbox', { name: 'Поиск по ролям' })).toBeDefined()

    await userEvent.click(screen.getAllByRole('button', { name: 'Просмотр' })[0] ?? document.body)

    expect(screen.queryByRole('searchbox', { name: 'Поиск по ролям' })).toBeNull()
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
