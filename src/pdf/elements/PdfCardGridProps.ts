import type { ReactElement } from 'react'

export interface PdfCardGridProps {
  /** Карточки с ключами, по порядку. */
  cards: ReactElement[]
  columns: 1 | 2
  /** Расстояние между карточками по вертикали, мм. По умолчанию 2. */
  gap?: number
  /** Делить свободную высоту между строками поровну, карточки по центру строки. */
  isStretched?: boolean
}
