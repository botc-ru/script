import type { RolesById } from '../../../types/RolesById'
import type { ScriptProps } from '../ScriptProps'

export type ScriptSectionsProps = Omit<ScriptProps, 'roles'> & {
  roles: RolesById
}
