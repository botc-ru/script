import { useMemo, useState } from 'react'
import type { Role, RolesById } from './types'
import { TeamFilters, type TeamFilter } from './TeamFilters'
import { compareByAso } from './aso'
import './RolePanel.css'

export type { TeamFilter }
type SortBy = 'name' | 'aso'

interface RolePanelProps {
  roles: RolesById
  loading: boolean
  error: string | null
  onSelect: (role: Role) => void
  selectedRoleIds?: Set<string>
  onDeselect?: (roleId: string) => void
  teamFilter: TeamFilter
  onTeamFilterChange: (team: TeamFilter) => void
}

export function RolePanel({
  roles,
  loading,
  error,
  onSelect,
  selectedRoleIds,
  onDeselect,
  teamFilter,
  onTeamFilterChange,
}: RolePanelProps) {
  const [sortBy, setSortBy] = useState<SortBy>('name')
  const [search, setSearch] = useState('')

  const visibleRoles = useMemo(() => {
    const query = search.trim().toLowerCase()

    const filtered = Object.values(roles).filter((role) => {
      if (teamFilter !== 'all' && role.team !== teamFilter) {
        return false
      }
      if (query === '') {
        return true
      }
      return (
        role.name.toLowerCase().includes(query) ||
        role.ability.toLowerCase().includes(query) ||
        role.id.toLowerCase().includes(query)
      )
    })

    return filtered.sort((a, b) => {
      if (sortBy === 'aso') {
        return compareByAso(a, b)
      }
      return a.name.localeCompare(b.name, 'ru')
    })
  }, [roles, teamFilter, sortBy, search])

  return (
    <div className="role-panel">
      <TeamFilters value={teamFilter} onChange={onTeamFilterChange} />

      <div className="role-panel__search-row">
        <input
          type="search"
          className="role-panel__search"
          placeholder="Поиск"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <button
          type="button"
          className="role-panel__sort"
          onClick={() => setSortBy((current) => (current === 'name' ? 'aso' : 'name'))}
        >
          {sortBy === 'name' ? 'Имя' : 'Порядок'}
        </button>
      </div>

      <ul className="role-panel__list">
        {loading && <li className="role-panel__empty">Загрузка ролей...</li>}
        {!loading && error && (
          <li className="role-panel__empty">Не удалось загрузить роли: {error}</li>
        )}
        {!loading &&
          !error &&
          visibleRoles.map((role) => {
            const isSelected = selectedRoleIds?.has(role.id) ?? false
            return (
              <li key={role.id} className={`role-panel__item role-panel__item--${role.team}`}>
                <button
                  type="button"
                  className={`role-panel__row${isSelected ? ' role-panel__row--selected' : ''}`}
                  onClick={() => (isSelected ? onDeselect?.(role.id) : onSelect(role))}
                >
                  <img src={role.image} alt="" className="role-panel__icon" />
                  <span className="role-panel__name">{role.name}</span>
                </button>
              </li>
            )
          })}
        {!loading && !error && visibleRoles.length === 0 && (
          <li className="role-panel__empty">Ничего не найдено</li>
        )}
      </ul>
    </div>
  )
}
