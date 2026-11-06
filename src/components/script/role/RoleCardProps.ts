import type { Role } from '../../../types/Role'

export interface RoleCardProps {
  role: Role
  jinxPartners?: Role[]
  /** Вести на страницу роли в вики. Игнорируется, если передан `onRemove`. */
  isLink?: boolean
  onRemove?: () => void
  onDropRole?: (roleId: string) => void
}
