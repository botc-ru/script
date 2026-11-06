import type { Team } from '../types/Team'

export const PDF_TEXT_COLOR = '#333'
export const PDF_ACCENT_COLOR = '#776644'

/** CSS-переменные в PDF недоступны. Значения совпадают с `styles/colors.css`. */
export const PDF_TEAM_COLORS: Record<Team, string> = {
  townsfolk: '#0066bb',
  outsider: '#0066bb',
  minion: '#aa2211',
  demon: '#aa2211',
  traveller: '#550044',
  fabled: '#776644',
  loric: '#227744',
}
