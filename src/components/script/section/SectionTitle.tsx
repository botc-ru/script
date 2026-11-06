import type { SectionTitleProps } from './SectionTitleProps'

import './SectionTitle.css'

/**
 * Заголовок секции сценария: название, счётчик и горизонтальная линия справа.
 */
export function SectionTitle({ title, count }: SectionTitleProps) {
  return <h2 className="section-title">{title} ({count})</h2>
}
