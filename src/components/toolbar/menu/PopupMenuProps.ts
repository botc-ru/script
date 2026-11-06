import type { LucideIcon } from 'lucide-react'

import type { MenuGroup } from './MenuGroup'

export interface PopupMenuProps {
  icon: LucideIcon
  label: string
  groups: MenuGroup[]
  /** Край кнопки, к которому прижато меню. */
  align: 'left' | 'right'
}
