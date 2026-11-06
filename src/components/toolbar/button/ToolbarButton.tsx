import type { ToolbarButtonProps } from './ToolbarButtonProps'

import './ToolbarButton.css'

/**
 * Плавающая кнопка с иконкой. Подпись всегда доступна как всплывающая подсказка
 * и для экранных дикторов, а видимая подпись включается через `showLabel`.
 */
export function ToolbarButton({
  icon: Icon,
  label,
  showLabel = false,
  isActive,
  disabled = false,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className="toolbar-button"
      aria-label={label}
      title={label}
      aria-pressed={isActive}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon size={20} aria-hidden />
      {showLabel && <span className="toolbar-button__label">{label}</span>}
    </button>
  )
}
