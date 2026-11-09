import type { ReactElement } from 'react'

export interface PdfCardGridProps {
  /** Карточки с ключами, по порядку. */
  cards: ReactElement[]
  columns: 1 | 2
}
