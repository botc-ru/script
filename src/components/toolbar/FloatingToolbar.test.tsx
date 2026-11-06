import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { finishAnimation } from '../../test/finishAnimation'
import { TEST_ROLES } from '../../test/testRoles'
import { FloatingToolbar } from './FloatingToolbar'
import type { FloatingToolbarProps } from './FloatingToolbarProps'

function renderToolbar(props: Partial<FloatingToolbarProps> = {}) {
  const defaults: FloatingToolbarProps = {
    mode: 'edit',
    onModeChange: vi.fn(),
    roles: { status: 'ready', roles: TEST_ROLES },
    selectedRoleIds: [],
    onToggleRole: vi.fn(),
    canUndo: false,
    canRedo: false,
    onUndo: vi.fn(),
    onRedo: vi.fn(),
  }
  return render(<FloatingToolbar {...defaults} {...props} />)
}

function getSearchContainer() {
  const container = screen.getByRole('searchbox').parentElement
  if (!container) throw new Error('Search container not found')
  return container
}

async function typeSearch(text: string) {
  await userEvent.click(screen.getByRole('button', { name: 'Поиск' }))
  await userEvent.type(screen.getByRole('searchbox'), text)
}

describe('FloatingToolbar', () => {
  it('в просмотре не показывает поиск и отмену', () => {
    renderToolbar({ mode: 'view', canUndo: true, canRedo: true })

    expect(screen.queryByRole('button', { name: 'Поиск' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Отменить' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Повторить' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Поделиться' })).toBeDefined()
  })

  it('в просмотре слева показывает только кнопку Редактировать', () => {
    renderToolbar({ mode: 'view' })

    expect(screen.getByRole('button', { name: 'Редактировать' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Меню' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Роли' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Макет' })).toBeNull()
  })

  it('переключает режим', async () => {
    const onModeChange = vi.fn()
    renderToolbar({ mode: 'view', onModeChange })

    await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }))

    expect(onModeChange).toHaveBeenCalledWith('edit')
  })

  it('показывает отмену и повтор, только когда они доступны', async () => {
    const onUndo = vi.fn()
    renderToolbar({ canUndo: true, onUndo })

    expect(screen.queryByRole('button', { name: 'Повторить' })).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Отменить' }))

    expect(onUndo).toHaveBeenCalledOnce()
  })

  it('открытый поиск заменяет Поделиться крестиком', async () => {
    renderToolbar()

    await userEvent.click(screen.getByRole('button', { name: 'Поиск' }))

    expect(screen.getByRole('searchbox')).toBe(document.activeElement)
    expect(screen.queryByRole('button', { name: 'Поделиться' })).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'Закрыть поиск' }))
    finishAnimation(getSearchContainer())

    expect(screen.queryByRole('searchbox')).toBeNull()
    expect(screen.getByRole('button', { name: 'Поделиться' })).toBeDefined()
  })

  it('не открывает поиск снова после смены режима', async () => {
    const { rerender } = renderToolbar()
    const props = {
      onModeChange: vi.fn(),
      roles: { status: 'loading' } as const,
      selectedRoleIds: [],
      onToggleRole: vi.fn(),
      canUndo: false,
      canRedo: false,
      onUndo: vi.fn(),
      onRedo: vi.fn(),
    }

    await userEvent.click(screen.getByRole('button', { name: 'Поиск' }))
    await userEvent.click(screen.getByRole('button', { name: 'Просмотр' }))
    rerender(<FloatingToolbar mode="view" {...props} />)
    rerender(<FloatingToolbar mode="edit" {...props} />)

    expect(screen.queryByRole('searchbox')).toBeNull()
  })

  it('закрывает поиск по Escape', async () => {
    renderToolbar()

    await userEvent.click(screen.getByRole('button', { name: 'Поиск' }))
    await userEvent.keyboard('{Escape}')
    finishAnimation(getSearchContainer())

    expect(screen.queryByRole('searchbox')).toBeNull()
  })

  it('держит поле на экране до конца анимации закрытия', async () => {
    renderToolbar()

    await userEvent.click(screen.getByRole('button', { name: 'Поиск' }))
    finishAnimation(getSearchContainer())
    expect(screen.getByRole<HTMLInputElement>('searchbox').disabled).toBe(false)

    await userEvent.click(screen.getByRole('button', { name: 'Закрыть поиск' }))
    expect(screen.getByRole<HTMLInputElement>('searchbox').disabled).toBe(true)

    finishAnimation(getSearchContainer())
    expect(screen.queryByRole('searchbox')).toBeNull()
  })

  it('показывает совпадения только после ввода', async () => {
    renderToolbar()

    await userEvent.click(screen.getByRole('button', { name: 'Поиск' }))
    expect(screen.queryByRole('list')).toBeNull()

    await userEvent.type(screen.getByRole('searchbox'), 'пов')
    expect(screen.getByRole('button', { name: 'Повар' })).toBeDefined()
  })

  it('показывает не больше 5 совпадений', async () => {
    renderToolbar()

    await typeSearch('а')

    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })

  it('сообщает, что ничего не найдено', async () => {
    renderToolbar()

    await typeSearch('ъъъ')

    expect(screen.getByText('Ничего не найдено')).toBeDefined()
  })

  it('не показывает совпадения, пока роли не загружены', async () => {
    renderToolbar({ roles: { status: 'loading' } })

    await typeSearch('пов')

    expect(screen.queryByRole('list')).toBeNull()
  })

  it('отмечает роли, которые уже есть в сценарии', async () => {
    renderToolbar({ selectedRoleIds: ['chef'] })

    await typeSearch('пов')

    expect(screen.getByRole('button', { name: 'Повар', pressed: true })).toBeDefined()
  })

  it('выбор роли переключает её, очищает поле и закрывает поиск', async () => {
    const onToggleRole = vi.fn()
    renderToolbar({ onToggleRole })

    await typeSearch('пов')
    await userEvent.click(screen.getByRole('button', { name: 'Повар' }))

    expect(onToggleRole).toHaveBeenCalledWith('chef')
    expect(screen.getByRole<HTMLInputElement>('searchbox').value).toBe('')
    expect(screen.queryByRole('list')).toBeNull()

    finishAnimation(getSearchContainer())
    expect(screen.queryByRole('searchbox')).toBeNull()
  })

  it('меню закрывается повторным нажатием на кнопку', async () => {
    renderToolbar()

    await userEvent.click(screen.getByRole('button', { name: 'Меню' }))
    await userEvent.click(screen.getByRole('button', { name: 'Меню' }))

    expect(screen.queryByRole('listitem')).toBeNull()
  })

  it('меню открывается по кнопке и закрывается после выбора пункта', async () => {
    const onModeChange = vi.fn()
    renderToolbar({ onModeChange })

    await userEvent.click(screen.getByRole('button', { name: 'Меню' }))
    const items = screen.getAllByRole('listitem').map((item) => item.textContent)

    expect(items).toEqual(['Просмотр', 'Роли', 'Макет'])

    await userEvent.click(screen.getAllByRole('button', { name: 'Просмотр' })[1] ?? document.body)

    expect(onModeChange).toHaveBeenCalledWith('view')
    expect(screen.queryByRole('listitem')).toBeNull()
  })
})
