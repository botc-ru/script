import type { ActiveJinx } from '../../types/ActiveJinx'
import type { Role } from '../../types/Role'

export interface PdfRoleSectionProps {
  title: string
  roles: Role[]
  jinxes: ActiveJinx[]
}
