import type { NightOrderEntry } from '../../types/NightOrderEntry'

export interface NightDetailColumnProps {
  title: string
  entries: NightOrderEntry[]
  scriptTitle: string
  /** Повернуть заголовок и строки на 180°. */
  isRotated?: boolean
}
