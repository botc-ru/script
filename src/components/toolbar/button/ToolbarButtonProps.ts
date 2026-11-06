import type { LucideIcon } from 'lucide-react'

export interface ToolbarButtonProps {
  icon: LucideIcon
  label: string
  /** Показывать подпись рядом с иконкой. На телефоне подпись всегда скрыта. */
  showLabel?: boolean
  /** Кнопка открытого экрана или панели. */
  isActive?: boolean
  disabled?: boolean
  onClick?: () => void
}
