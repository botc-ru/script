import type { TeamFilter } from '../../../types/TeamFilter'

export interface TeamFiltersProps {
  value: TeamFilter
  onChange: (value: TeamFilter) => void
}
