import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RolesProvider } from '../../contexts/roles/RolesProvider'
import type { RolesState } from '../../contexts/roles/RolesState'
import { useRoles } from '../../contexts/roles/useRoles'
import { TEST_ROLES } from '../../test/testRoles'
import type { ScriptData } from '../../types/ScriptData'
import type { ScriptMode } from '../../types/ScriptMode'
import { Script } from './Script'

const READY_ROLES: RolesState = { status: 'ready', roles: TEST_ROLES }

function createScript(roleIds: string[], customOrder = false): ScriptData {
  return { name: 'Тест', author: 'Автор', color: '#000000', roleIds, customOrder }
}

interface EditableScriptProps {
  roleIds: string[]
  mode: ScriptMode
  rolesState?: RolesState
  customOrder?: boolean
}

function EditableScript({
  roleIds,
  mode,
  rolesState = READY_ROLES,
  customOrder = false,
}: EditableScriptProps) {
  const [script, setScript] = useState(createScript(roleIds, customOrder))

  return (
    <Script
      script={script}
      roles={rolesState}
      mode={mode}
      onChange={(patch) => setScript((current) => ({ ...current, ...patch }))}
    />
  )
}

function LoadedScript({ roleIds }: { roleIds: string[] }) {
  return <Script script={createScript(roleIds)} roles={useRoles()} mode="view" />
}

function getRoleNames() {
  return Array.from(document.querySelectorAll('.role-card__name'), (name) => name.textContent)
}

function dragRole(from: string, to: string) {
  const data = new Map<string, string>()
  const dataTransfer = {
    setData: (type: string, value: string) => data.set(type, value),
    getData: (type: string) => data.get(type) ?? '',
  }

  fireEvent.dragStart(screen.getByRole('button', { name: new RegExp(from) }), { dataTransfer })
  fireEvent.drop(screen.getByRole('button', { name: new RegExp(to) }), { dataTransfer })
}

function getSection(name: RegExp) {
  const section = screen.getByRole('heading', { name }).closest('section')
  if (!section) throw new Error('Section not found')
  return section
}

describe('Script', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('показывает загруженные роли в секциях их команд', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(Response.json(TEST_ROLES))))

    render(
      <RolesProvider>
        <LoadedScript roleIds={['librarian', 'drunk']} />
      </RolesProvider>,
    )

    expect(screen.getByText('Загрузка ролей...')).toBeDefined()
    await screen.findByText('Библиотекарь')
    expect(within(getSection(/^Горожане/)).getByText('Библиотекарь')).toBeDefined()
    expect(within(getSection(/^Горожане/)).getByText('Узнаёт Изгоя')).toBeDefined()
    expect(within(getSection(/^Изгои/)).getByText('Пьяница')).toBeDefined()
    expect(within(getSection(/^Горожане/)).queryByText('Пьяница')).toBeNull()
  })

  it('показывает заголовок до загрузки ролей, а секции скрывает', () => {
    render(<Script script={createScript(['librarian'])} roles={{ status: 'loading' }} mode="view" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Тест' })).toBeDefined()
    expect(screen.getByText('Автор')).toBeDefined()
    expect(screen.getByText('Загрузка ролей...')).toBeDefined()
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull()
  })

  it('показывает заголовок и сообщение, если роли не загрузились', () => {
    render(<Script script={createScript(['librarian'])} roles={{ status: 'error' }} mode="view" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Тест' })).toBeDefined()
    expect(screen.getByText('Не удалось загрузить роли')).toBeDefined()
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull()
  })

  it('позволяет менять заголовок до загрузки ролей', async () => {
    render(<EditableScript roleIds={[]} mode="edit" rolesState={{ status: 'loading' }} />)

    await userEvent.type(screen.getByPlaceholderText('Название сценария'), '!')

    expect(screen.getByDisplayValue('Тест!')).toBeDefined()
  })

  it('показывает четыре основные секции, даже если они пустые', () => {
    render(<Script script={createScript([])} roles={READY_ROLES} mode="view" />)

    const titles = screen.getAllByRole('heading', { level: 2 }).map((title) => title.textContent)

    expect(titles).toEqual(['Горожане (0)', 'Изгои (0)', 'Приспешники (0)', 'Демоны (0)'])
  })

  it('скрывает пустые необязательные секции', () => {
    render(<Script script={createScript(['librarian'])} roles={READY_ROLES} mode="view" />)

    expect(screen.queryByRole('heading', { name: /Летописцы/ })).toBeNull()
    expect(screen.queryByRole('heading', { name: /Сказочники/ })).toBeNull()
    expect(screen.queryByRole('heading', { name: /Странники/ })).toBeNull()
  })

  it('показывает необязательные секции с ролями в строгом порядке', () => {
    const roleIds = ['beggar', 'ferryman', 'knaves']

    render(<Script script={createScript(roleIds)} roles={READY_ROLES} mode="view" />)

    const titles = screen.getAllByRole('heading', { level: 2 }).map((title) => title.textContent)

    expect(titles.slice(4)).toEqual(['Летописцы (1)', 'Сказочники (1)', 'Странники (1)'])
  })

  it('меняет название сценария, не затрагивая автора', async () => {
    render(<EditableScript roleIds={[]} mode="edit" />)

    const name = screen.getByPlaceholderText('Название сценария')
    await userEvent.clear(name)
    await userEvent.type(name, 'Новое название')

    expect(screen.getByDisplayValue('Новое название')).toBe(name)
    expect(screen.getByDisplayValue('Автор')).toBeDefined()
  })

  it('меняет автора сценария, не затрагивая название', async () => {
    render(<EditableScript roleIds={[]} mode="edit" />)

    const author = screen.getByPlaceholderText('Автор')
    await userEvent.clear(author)
    await userEvent.type(author, 'Новый автор')

    expect(screen.getByDisplayValue('Новый автор')).toBe(author)
    expect(screen.getByDisplayValue('Тест')).toBeDefined()
  })

  it('меняет цвет сценария', () => {
    render(<EditableScript roleIds={[]} mode="edit" />)

    const color = screen.getByTitle('Цвет сценария')
    fireEvent.change(color, { target: { value: '#ff0000' } })

    expect(screen.getByDisplayValue('#ff0000')).toBe(color)
    expect(screen.getByDisplayValue('Тест')).toBeDefined()
  })

  it('не показывает поля редактирования в режиме просмотра', () => {
    render(<EditableScript roleIds={[]} mode="view" />)

    expect(screen.queryByRole('textbox')).toBeNull()
    expect(screen.queryByTitle('Цвет сценария')).toBeNull()
    expect(screen.getByRole('heading', { level: 1, name: 'Тест' })).toBeDefined()
  })

  it('без customOrder сортирует роли автоматически', () => {
    const script = createScript(['librarian', 'chef'])

    render(<Script script={script} roles={READY_ROLES} mode="view" />)

    expect(getRoleNames()).toEqual(['Повар', 'Библиотекарь'])
  })

  it('с customOrder показывает роли в порядке упоминания', () => {
    const script = createScript(['librarian', 'chef'], true)

    render(<Script script={script} roles={READY_ROLES} mode="view" />)

    expect(getRoleNames()).toEqual(['Библиотекарь', 'Повар'])
  })

  it('перетаскивание закрепляет порядок и переставляет роли', () => {
    render(<EditableScript roleIds={['librarian', 'chef']} mode="edit" customOrder />)

    dragRole('Библиотекарь', 'Повар')

    expect(getRoleNames()).toEqual(['Повар', 'Библиотекарь'])

    dragRole('Библиотекарь', 'Повар')

    expect(getRoleNames()).toEqual(['Библиотекарь', 'Повар'])
  })

  it('перетаскивание работает от показанного порядка при автосортировке', () => {
    render(<EditableScript roleIds={['librarian', 'chef']} mode="edit" />)
    const [first, second] = getRoleNames()

    dragRole(first ?? '', second ?? '')

    expect(getRoleNames()).toEqual([second, first])
  })

  it('не переносит роль в другую секцию', () => {
    render(<EditableScript roleIds={['librarian', 'drunk']} mode="edit" />)

    dragRole('Библиотекарь', 'Пьяница')

    expect(within(getSection(/^Горожане/)).getByText('Библиотекарь')).toBeDefined()
  })

  it('в просмотре карточка ведёт на вики', () => {
    render(<Script script={createScript(['librarian'])} roles={READY_ROLES} mode="view" />)

    const link = screen.getByRole('link', { name: /Библиотекарь/ })

    expect(link.getAttribute('href')).toBe('https://wiki.bloodontheclocktower.com/librarian')
    expect(link.getAttribute('target')).toBe('_blank')
  })

  it('в редактировании ссылок на вики нет', () => {
    render(<Script script={createScript(['librarian'])} roles={READY_ROLES} mode="edit" />)

    expect(screen.queryByRole('link')).toBeNull()
  })

  it('без джинксов не показывает Джинна и Правила Джинна', () => {
    render(<Script script={createScript(['goon'])} roles={READY_ROLES} mode="view" />)

    expect(screen.queryByText('Джинн')).toBeNull()
    expect(screen.queryByRole('heading', { name: /Правила Джинна/ })).toBeNull()
    expect(screen.queryByAltText(/Джинкс/)).toBeNull()
  })

  it('при джинксе показывает иконки у обеих ролей, Джинна и его правила', () => {
    const script = createScript(['goon', 'boffin', 'beggar'])

    render(<Script script={script} roles={READY_ROLES} mode="view" />)

    expect(within(getSection(/^Изгои/)).getByAltText('Джинкс: Умник')).toBeDefined()
    expect(within(getSection(/^Приспешники/)).getByAltText('Джинкс: Громила')).toBeDefined()
    expect(within(getSection(/^Сказочники/)).getByText('Джинн')).toBeDefined()
    expect(within(getSection(/^Правила Джинна/)).getByText('Правило Умника и Громилы')).toBeDefined()

    const titles = screen.getAllByRole('heading', { level: 2 }).map((title) => title.textContent)

    expect(titles.slice(4)).toEqual(['Сказочники (1)', 'Правила Джинна (1)', 'Странники (1)'])
  })

  it('не дублирует Джинна и не даёт удалить его при джинксах', () => {
    render(<EditableScript roleIds={['goon', 'boffin', 'djinn', 'ferryman']} mode="edit" />)

    expect(screen.getAllByText('Джинн')).toHaveLength(1)
    expect(screen.queryByRole('button', { name: /Джинн/ })).toBeNull()
    expect(screen.queryByRole('link', { name: /Джинн/ })).toBeNull()
    expect(within(getSection(/^Сказочники/)).getAllByRole('listitem')).toHaveLength(2)
  })

  it('убирает Джинна, когда джинксов больше нет', async () => {
    render(<EditableScript roleIds={['goon', 'boffin']} mode="edit" />)

    await userEvent.click(screen.getByRole('button', { name: /^Умник/ }))

    expect(screen.queryByText('Джинн')).toBeNull()
    expect(screen.queryByRole('heading', { name: /Правила Джинна/ })).toBeNull()
  })

  it('удаляет роль по клику в режиме редактирования', async () => {
    render(<EditableScript roleIds={['librarian', 'chef']} mode="edit" />)

    await userEvent.click(screen.getByRole('button', { name: /Библиотекарь/ }))

    expect(screen.queryByText('Библиотекарь')).toBeNull()
    expect(screen.getByText('Повар')).toBeDefined()
    expect(screen.getByRole('heading', { name: 'Горожане (1)' })).toBeDefined()
  })

  it('не удаляет роль по клику в режиме просмотра', async () => {
    render(<EditableScript roleIds={['librarian']} mode="view" />)

    await userEvent.click(screen.getByText('Библиотекарь'))

    expect(screen.getByText('Библиотекарь')).toBeDefined()
  })
})
