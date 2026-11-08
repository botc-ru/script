import type { NightOrderEntry } from '../../types/NightOrderEntry'

export interface NightColumnProps {
  title: string
  entries: NightOrderEntry[]
  /** Повернуть заголовок и строки на 180°. */
  isRotated?: boolean
  /** Оставить пустое место той же ширины вместо колонки. */
  isHidden?: boolean
}
