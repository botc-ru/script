import type { NightOrderEntry } from '../../types/NightOrderEntry'

export interface NightColumnProps {
  title: string
  entries: NightOrderEntry[]
  /** Перевернуть колонку: её читает рассказчик с другой стороны листа. */
  isRotated?: boolean
}
