import { TEAM_LABELS } from '../../../types/TeamLabels'
import { TEAMS } from '../../../types/TeamOrder'
import { getTeamIconUrl } from '../../../utils/getTeamIconUrl'
import type { TeamFiltersProps } from './TeamFiltersProps'

import './TeamFilters.css'

/**
 * Фильтр ролей по командам: кнопка «Все» и иконка каждой команды. Выбран всегда один вариант.
 *
 * На телефоне кнопки круглые и фиксированного размера, лишнее место делится между ними.
 */
export function TeamFilters({ value, onChange }: TeamFiltersProps) {
  return (
    <div className="team-filters">
      <button
        type="button"
        className="team-filters__button"
        aria-pressed={value === 'all'}
        onClick={() => onChange('all')}
      >
        Все
      </button>
      {TEAMS.map((team) => (
        <button
          key={team}
          type="button"
          className="team-filters__button"
          title={TEAM_LABELS[team]}
          aria-label={TEAM_LABELS[team]}
          aria-pressed={value === team}
          onClick={() => onChange(team)}
        >
          <img className="team-filters__icon" src={getTeamIconUrl(team)} alt="" />
        </button>
      ))}
    </div>
  )
}
