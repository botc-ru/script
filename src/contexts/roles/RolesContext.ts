import { createContext } from 'react'

import type { RolesState } from './RolesState'

export const RolesContext = createContext<RolesState | null>(null)
