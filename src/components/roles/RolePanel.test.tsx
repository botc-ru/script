import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { RolesState } from '../../contexts/roles/RolesState'
import { TEST_ROLES } from '../../test/testRoles'
import type { TeamFilter } from '../../types/TeamFilter'
import { RolePanel } from './RolePanel'
import type { RolePanelProps } from './RolePanelProps'

const READY: RolesState = {
  status: 'ready',
  roles: {
    ...TEST_ROLES,
    dusk: { id: 'dusk', name: 'Закат', ability: '', image: '' },
  },
}

function FilteredPanel(props: Partial<RolePanelProps>) {
  const [team, setTeam] = useState<TeamFilter>('all')

  return (
    <RolePanel
      roles={READY}
      selectedRoleIds={[]}
      team={team}
      onTeamChange={setTeam}
      onToggleRole={vi.fn()}
      {...props}
    />
  )
}

function renderPanel(props: Partial<RolePanelProps> = {}) {
  render(<FilteredPanel {...props} />)
}

function getNames() {
  return Array.from(document.querySelectorAll('.role-row__name'), (name) => name.textContent)
}

describe('RolePanel', () => {
  it('показывает все роли с командой по алфавиту, без служебных', () => {
    renderPanel()

    const names = getNames()

    expect(names).toHaveLength(Object.keys(TEST_ROLES).length)
    expect(names).not.toContain('Закат')
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'ru')))
  })

  it('фильтрует по команде и возвращается ко всем', async () => {
    renderPanel()

    await userEvent.click(screen.getByRole('button', { name: 'Демоны' }))
    expect(getNames()).toEqual(['Бес'])

    await userEvent.click(screen.getByRole('button', { name: 'Все' }))
    expect(getNames().length).toBeGreaterThan(1)
  })

  it('показывает команду, заданную снаружи', () => {
    renderPanel({ team: 'demon' })

    expect(getNames()).toEqual(['Бес'])
    expect(screen.getByRole('button', { name: 'Демоны', pressed: true })).toBeDefined()
  })

  it('ищет по списку и учитывает фильтр команды', async () => {
    renderPanel()

    await userEvent.type(screen.getByRole('searchbox'), 'пов')
    expect(getNames()).toEqual(['Повар'])

    await userEvent.click(screen.getByRole('button', { name: 'Демоны' }))
    expect(screen.getByText('Ничего не найдено')).toBeDefined()
  })

  it('переключает сортировку', async () => {
    renderPanel()

    await userEvent.click(screen.getByRole('button', { name: 'Имя' }))

    expect(screen.getByRole('button', { name: 'Порядок' })).toBeDefined()
    expect(getNames()[0]).toBe('Повар')
  })

  it('нажатие на роль вызывает переключение и подсвечивает выбранные', async () => {
    const onToggleRole = vi.fn()
    renderPanel({ onToggleRole, selectedRoleIds: ['chef'] })

    expect(screen.getByRole('button', { name: 'Повар', pressed: true })).toBeDefined()

    await userEvent.click(screen.getByRole('button', { name: 'Бес' }))

    expect(onToggleRole).toHaveBeenCalledWith('imp')
  })

  it('показывает сообщения о загрузке и об ошибке', () => {
    renderPanel({ roles: { status: 'loading' } })
    expect(screen.getByText('Загрузка ролей...')).toBeDefined()
  })

  it('показывает сообщение об ошибке', () => {
    renderPanel({ roles: { status: 'error' } })
    expect(screen.getByText('Не удалось загрузить роли')).toBeDefined()
  })
})
