import type { Role } from '../../types/Role'

export interface PdfRoleCardProps {
  role: Role
  jinxPartners?: Role[]
  /** Имя и способность в одну строку: для листа в одну колонку. */
  isCompact?: boolean
  /** Окрасить имя в цвет команды. */
  isColored?: boolean
}
