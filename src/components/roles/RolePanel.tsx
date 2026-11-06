import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { RoleSort } from '../../types/RoleSort'
import type { TeamFilter } from '../../types/TeamFilter'
import { searchRoles } from '../../utils/searchRoles'
import { sortRoles } from '../../utils/sortRoles'
import { TeamFilters } from './filters/TeamFilters'
import { RoleList } from './list/RoleList'
import type { RolePanelProps } from './RolePanelProps'

import './RolePanel.css'

/**
 * Панель выбора ролей: сверху поиск, сортировка и фильтры по командам, ниже список.
 * Нажатие на роль добавляет её в сценарий или удаляет, панель остаётся открытой.
 *
 * На ПК это панель слева со своей прокруткой. На телефоне это отдельный экран: прокручивается
 * вся страница, поле поиска плавает внизу между кнопками, а фильтры плавающей панелью над ним.
 * Экран возвращается к началу списка при открытии и при нажатии на поле поиска. Это делается
 * до появления клавиатуры: на телефоне при открытой клавиатуре прокрутка сбивает положение
 * закреплённых панелей, поэтому при вводе она не меняется.
 */
export function RolePanel({ roles, selectedRoleIds, onToggleRole }: RolePanelProps) {
  const [query, setQuery] = useState('')
  const [team, setTeam] = useState<TeamFilter>('all')
  const [sort, setSort] = useState<RoleSort>('name')
  const panelRef = useRef<HTMLDivElement>(null)

  function scrollToStart() {
    panelRef.current?.scrollIntoView()
  }

  useEffect(scrollToStart, [])

  const allRoles = roles.status === 'ready'
    ? Object.values(roles.roles).filter((role) => role.team)
    : []
  const teamRoles = allRoles.filter((role) => team === 'all' || role.team === team)
  const foundRoles = query.trim() ? searchRoles(teamRoles, query) : teamRoles

  return (
    <div className="role-panel" ref={panelRef}>
      <div className="role-panel__controls">
        <div className="role-panel__search">
          <Search className="role-panel__search-icon" size={16} aria-hidden />
          <input
            type="search"
            className="role-panel__input"
            placeholder="Поиск"
            aria-label="Поиск по ролям"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onPointerDown={(event) => {
              if (event.currentTarget !== document.activeElement) scrollToStart()
            }}
          />
          <button
            type="button"
            className="role-panel__sort"
            onClick={() => setSort(sort === 'name' ? 'sao' : 'name')}
          >
            {sort === 'name' ? 'Имя' : 'Порядок'}
          </button>
        </div>
        <div className="role-panel__filters">
          <TeamFilters value={team} onChange={setTeam} />
        </div>
      </div>

      <div className="role-panel__list">
        <RoleList
          status={roles.status}
          roles={sortRoles(foundRoles, sort)}
          selectedRoleIds={selectedRoleIds}
          onToggleRole={onToggleRole}
        />
      </div>
    </div>
  )
}
