import type { RolesById } from '../../types/RolesById'
import type { ScriptData } from '../../types/ScriptData'
import type { ScriptMode } from '../../types/ScriptMode'

export interface ScriptProps {
  script: ScriptData
  roles: RolesById
  mode: ScriptMode
  onChange?: (patch: Partial<ScriptData>) => void
}
