import { useMemo, useRef, useState } from 'react'
import type { Role, RolesById } from './types'
import './QuickAddRole.css'

interface QuickAddRoleProps {
  roles: RolesById
  onSelect: (role: Role) => void
  onDeselect: (roleId: string) => void
  selectedRoleIds: Set<string>
}

export function QuickAddRole({ roles, onSelect, onDeselect, selectedRoleIds }: QuickAddRoleProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (trimmed === '') return []

    return Object.values(roles)
      .filter(
        (role) =>
          role.name.toLowerCase().includes(trimmed) ||
          role.ability.toLowerCase().includes(trimmed) ||
          role.id.toLowerCase().includes(trimmed),
      )
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }, [roles, query])

  function handleSelect(role: Role) {
    if (selectedRoleIds.has(role.id)) {
      onDeselect(role.id)
    } else {
      onSelect(role)
    }
    setQuery('')
    setIsOpen(false)
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
      setIsOpen(false)
    }
  }

  return (
    <div className="quick-add-role" ref={containerRef} onBlur={handleBlur}>
      <input
        type="search"
        className="quick-add-role__input"
        placeholder="Поиск"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setIsOpen(false)
        }}
      />

      {isOpen && query.trim() !== '' && (
        <div className="quick-add-role__panel">
          <ul className="quick-add-role__list">
            {results.length === 0 && <li className="quick-add-role__empty">Ничего не найдено</li>}
            {results.map((role) => {
              const isSelected = selectedRoleIds.has(role.id)
              return (
                <li key={role.id}>
                  <button
                    type="button"
                    className={`quick-add-role__row${isSelected ? ' quick-add-role__row--selected' : ''}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(role)}
                  >
                    <img src={role.image} alt="" className="quick-add-role__icon" />
                    <span className="quick-add-role__name">{role.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
