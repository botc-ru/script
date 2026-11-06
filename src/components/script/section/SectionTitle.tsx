import type { SectionTitleProps } from './SectionTitleProps'

import './SectionTitle.css'

/**
 * Заголовок секции сценария: название, счётчик и горизонтальная линия справа.
 *
 * Если передан `onClick`, название становится кнопкой.
 */
export function SectionTitle({ title, count, onClick }: SectionTitleProps) {
  const text = `${title} (${count})`

  return (
    <h2 className="section-title">
      {onClick
        ? <button type="button" className="section-title__button" onClick={onClick}>{text}</button>
        : text}
    </h2>
  )
}
