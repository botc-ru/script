import type { RolesById } from '../../types/RolesById'

export type RolesState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready', roles: RolesById }
