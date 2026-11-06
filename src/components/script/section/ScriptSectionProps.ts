import type { Role } from '../../../types/Role'

export interface ScriptSectionProps {
  title: string
  roles: Role[]
  onRemoveRole?: (roleId: string) => void
  onMoveRole?: (roleId: string, targetId: string) => void
}
