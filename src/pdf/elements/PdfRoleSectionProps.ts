import type { Style } from '@react-pdf/types'

import type { ActiveJinx } from '../../types/ActiveJinx'
import type { Role } from '../../types/Role'

export interface PdfRoleSectionProps {
  title: string
  roles: Role[]
  jinxes: ActiveJinx[]
  columns: 1 | 2
  /** Расстояние между ролями по вертикали, мм. По умолчанию 2. */
  gap?: number
  /** Растянуть секцию на свободную высоту листа, см. `PdfCardGrid`. */
  isStretched?: boolean
  /** Карточки в одну строку, см. `PdfRoleCard`. */
  isCompact?: boolean
  titleStyle?: Style
}
