import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FloatingToolbar } from './FloatingToolbar'
import type { FloatingToolbarProps } from './FloatingToolbarProps'

function renderToolbar(props: Partial<FloatingToolbarProps> = {}) {
  const defaults: FloatingToolbarProps = {
    mode: 'edit',
    onModeChange: vi.fn(),
    canUndo: false,
    canRedo: false,
    onUndo: vi.fn(),
    onRedo: vi.fn(),
  }
  return render(<FloatingToolbar {...defaults} {...props} />)
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

    expect(screen.queryByRole('searchbox')).toBeNull()
    expect(screen.getByRole('button', { name: 'Поделиться' })).toBeDefined()
  })

  it('не открывает поиск снова после смены режима', async () => {
    const { rerender } = renderToolbar()
    const props = {
      onModeChange: vi.fn(),
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
