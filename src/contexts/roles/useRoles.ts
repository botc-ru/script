import { useContext } from 'react'

import { RolesContext } from './RolesContext'
import type { RolesState } from './RolesState'

/**
 * Возвращает состояние загрузки ролей.
 *
 * Работает только внутри {@link RolesProvider}.
 */
export function useRoles(): RolesState {
  const state = useContext(RolesContext)
  if (!state) throw new Error('useRoles must be used inside RolesProvider')
  return state
}
