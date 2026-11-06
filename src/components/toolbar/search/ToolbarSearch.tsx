import type { ToolbarSearchProps } from './ToolbarSearchProps'

import './ToolbarSearch.css'

/**
 * Поле быстрого поиска. Получает фокус при открытии, закрывается по Escape.
 *
 * При открытии плавно растягивается от размера кнопки: на телефоне на всю ширину, на ПК
 * до ограниченной ширины. При закрытии (`isClosing`) сжимается обратно, становится неактивным,
 * чтобы сразу убрать клавиатуру, а в конце анимации вызывает `onClosed`.
 * Результаты поиска пока не реализованы.
 */
export function ToolbarSearch({ isClosing, onClose, onClosed }: ToolbarSearchProps) {
  return (
    <input
      type="search"
      className={`toolbar-search${isClosing ? ' toolbar-search--closing' : ''}`}
      placeholder="Поиск"
      aria-label="Поиск"
      autoFocus
      disabled={isClosing}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
      onAnimationEnd={() => {
        if (isClosing) onClosed()
      }}
    />
  )
}
