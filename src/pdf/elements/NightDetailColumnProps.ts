import type { NightOrderEntry } from '../../types/NightOrderEntry'

export interface NightDetailColumnProps {
  title: string
  entries: NightOrderEntry[]
  scriptTitle: string
  scriptColor: string
  /** Повернуть заголовок и строки на 180°. */
  isRotated?: boolean
}
