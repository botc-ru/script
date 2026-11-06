import { useState } from 'react'

import { getSelectableRoles } from '../../../utils/getSelectableRoles'
import { searchRoles } from '../../../utils/searchRoles'
import { SearchResults } from './SearchResults'
import type { ToolbarSearchProps } from './ToolbarSearchProps'

import './ToolbarSearch.css'

const RESULTS_LIMIT = 5

/**
 * Поле быстрого поиска ролей. Получает фокус при открытии, закрывается по Escape.
 *
 * При вводе показывает первые 5 совпадений. Выбор роли добавляет её в сценарий или удаляет,
 * очищает поле и закрывает поиск.
 *
 * При открытии плавно растягивается от размера кнопки: на телефоне на всю ширину, на ПК
 * до ограниченной ширины. При закрытии (`isClosing`) сжимается обратно, становится неактивным,
 * чтобы сразу убрать клавиатуру, а в конце анимации вызывает `onClosed`.
 */
export function ToolbarSearch({
  roles,
  selectedRoleIds,
  isClosing,
  onToggleRole,
  onClose,
  onClosed,
}: ToolbarSearchProps) {
  const [query, setQuery] = useState('')
  const hasResults = roles.status === 'ready' && query.trim() !== '' && !isClosing

  function selectRole(roleId: string) {
    onToggleRole(roleId)
    setQuery('')
    onClose()
  }

  return (
    <div
      className={`toolbar-search${isClosing ? ' toolbar-search--closing' : ''}`}
      onAnimationEnd={() => {
        if (isClosing) onClosed()
      }}
    >
      <input
        type="search"
        className="toolbar-search__input"
        placeholder="Поиск"
        aria-label="Поиск"
        autoFocus
        disabled={isClosing}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onClose()
        }}
      />
      {hasResults && (
        <SearchResults
          roles={searchRoles(getSelectableRoles(roles.roles), query).slice(0, RESULTS_LIMIT)}
          selectedRoleIds={selectedRoleIds}
          onSelect={selectRole}
        />
      )}
    </div>
  )
}
