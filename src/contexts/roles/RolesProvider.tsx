import { useEffect, useState } from 'react'

import type { RolesById } from '../../types/RolesById'
import { RolesContext } from './RolesContext'
import type { RolesProviderProps } from './RolesProviderProps'
import type { RolesState } from './RolesState'

const ROLES_URL = 'https://raw.githubusercontent.com/botc-ru/data/main/roles.json'

/**
 * Загружает список ролей из репозитория `botc-ru/data` и передаёт его вложенным компонентам.
 *
 * Роли загружаются один раз при монтировании. Компоненты получают их через `useRoles`
 * и сами показывают состояния `loading` и `error`.
 */
export function RolesProvider({ children }: RolesProviderProps) {
  const [state, setState] = useState<RolesState>({ status: 'loading' })

  useEffect(() => {
    fetch(ROLES_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load roles: ${response.status}`)
        return response.json() as Promise<RolesById>
      })
      .then((roles) => setState({ status: 'ready', roles }))
      .catch(() => setState({ status: 'error' }))
  }, [])

  return <RolesContext value={state}>{children}</RolesContext>
}
