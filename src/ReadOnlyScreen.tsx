import { ScriptPanel } from './ScriptPanel'
import type { ScriptMeta } from './scriptModel'
import type { Role, RolesById } from './types'
import './App.css'

interface ReadOnlyScreenProps {
  scriptRoles: Role[]
  allRoles: RolesById
  script: ScriptMeta
}

export function ReadOnlyScreen({ scriptRoles, allRoles, script }: ReadOnlyScreenProps) {
  return (
    <div className="app">
      <ScriptPanel roles={scriptRoles} allRoles={allRoles} script={script} interactive={false} />
    </div>
  )
}
