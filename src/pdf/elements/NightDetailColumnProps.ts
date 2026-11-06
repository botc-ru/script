import type { NightOrderEntry } from '../../types/NightOrderEntry'

export interface NightDetailColumnProps {
  title: string
  entries: NightOrderEntry[]
  scriptTitle: string
  /** Перевернуть колонку: её читает рассказчик с другой стороны листа. */
  isRotated?: boolean
}
