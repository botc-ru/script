import type { ToolbarSearchProps } from './ToolbarSearchProps'

import './ToolbarSearch.css'

/**
 * Поле быстрого поиска. Получает фокус при открытии, закрывается по Escape.
 *
 * При открытии плавно растягивается от размера кнопки: на телефоне на всю ширину, на ПК
 * до ограниченной ширины. Результаты поиска пока не реализованы.
 */
export function ToolbarSearch({ onClose }: ToolbarSearchProps) {
  return (
    <input
      type="search"
      className="toolbar-search"
      placeholder="Поиск"
      aria-label="Поиск"
      autoFocus
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
    />
  )
}
