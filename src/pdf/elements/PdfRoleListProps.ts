import type { ActiveJinx } from '../../types/ActiveJinx'
import type { Role } from '../../types/Role'

export interface PdfRoleListProps {
  title: string
  roles: Role[]
  jinxes: ActiveJinx[]
}
