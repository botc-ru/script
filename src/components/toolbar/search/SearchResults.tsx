import { getTeamClass } from '../../../utils/getTeamClass'
import type { SearchResultsProps } from './SearchResultsProps'

import './SearchResults.css'

/**
 * Список совпадений поиска: слева иконка, справа название в цвете команды.
 *
 * Роли, которые уже есть в сценарии, подсвечены фоном. На телефоне список открывается над полем
 * поиска, на ПК под ним.
 */
export function SearchResults({ roles, selectedRoleIds, onSelect }: SearchResultsProps) {
  return (
    <ul className="search-results">
      {roles.length === 0 && <li className="search-results__empty">Ничего не найдено</li>}
      {roles.map((role) => {
        const isSelected = selectedRoleIds.includes(role.id)
        return (
          <li key={role.id}>
            <button
              type="button"
              className={`search-results__row ${getTeamClass(role.team)}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(role.id)}
            >
              <img className="search-results__icon" src={role.image} alt="" />
              <span className="search-results__name">{role.name}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
