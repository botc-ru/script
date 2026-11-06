import { RoleRow } from '../../roles/row/RoleRow'
import type { SearchResultsProps } from './SearchResultsProps'

import './SearchResults.css'

/**
 * Список совпадений поиска. На телефоне открывается над полем поиска, на ПК под ним.
 */
export function SearchResults({ roles, selectedRoleIds, onSelect }: SearchResultsProps) {
  return (
    <ul className="search-results">
      {roles.length === 0 && <li className="search-results__empty">Ничего не найдено</li>}
      {roles.map((role) => (
        <li key={role.id}>
          <RoleRow
            role={role}
            isSelected={selectedRoleIds.includes(role.id)}
            onClick={() => onSelect(role.id)}
          />
        </li>
      ))}
    </ul>
  )
}
