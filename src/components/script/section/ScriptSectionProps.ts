import type { ActiveJinx } from '../../../types/ActiveJinx'
import type { Role } from '../../../types/Role'

export interface ScriptSectionProps {
  title: string
  roles: Role[]
  /** Роли в начале секции, которые нельзя удалить или перетащить. */
  pinnedRoles?: Role[]
  jinxes: ActiveJinx[]
  onRemoveRole?: (roleId: string) => void
  onMoveRole?: (roleId: string, targetId: string) => void
  onTitleClick?: () => void
}
