import { getTeamIconUrl, TEAM_LABELS, TEAMS } from './teams'
import type { Team } from './types'

export type TeamFilter = 'all' | Team

interface TeamFiltersProps {
  value: TeamFilter
  onChange: (team: TeamFilter) => void
}

export function TeamFilters({ value, onChange }: TeamFiltersProps) {
  return (
    <div className="role-panel__filters">
      <button
        type="button"
        className={`role-panel__filter-all${value === 'all' ? ' active' : ''}`}
        title="Все"
        onClick={() => onChange('all')}
      >
        Все
      </button>
      {TEAMS.map((team) => (
        <button
          key={team}
          type="button"
          className={value === team ? 'active' : ''}
          title={TEAM_LABELS[team]}
          aria-label={TEAM_LABELS[team]}
          onClick={() => onChange(team)}
        >
          <img src={getTeamIconUrl(team)} alt="" className="role-panel__filter-icon" />
        </button>
      ))}
    </div>
  )
}
