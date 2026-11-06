import { useState } from 'react'

import { RolePanel } from './components/roles/RolePanel'
import { Script } from './components/script/Script'
import { FloatingToolbar } from './components/toolbar/FloatingToolbar'
import { useRoles } from './contexts/roles/useRoles'
import { useScript } from './hooks/useScript'
import type { ScriptMode } from './types/ScriptMode'
import { toggleRole } from './utils/toggleRole'

import './App.css'

/**
 * Корневой компонент приложения: сценарий, панель ролей и плавающие кнопки.
 *
 * Сценарий отрисовывается сразу, не дожидаясь загрузки ролей. Приложение всегда открывается
 * в режиме просмотра.
 */
export function App() {
  const roles = useRoles()
  const script = useScript()
  const [mode, setMode] = useState<ScriptMode>('view')
  const [isRolesOpen, setIsRolesOpen] = useState(false)

  function changeMode(nextMode: ScriptMode) {
    setMode(nextMode)
    setIsRolesOpen(false)
  }

  function toggleScriptRole(roleId: string) {
    script.update((current) => toggleRole(current, roleId))
  }

  return (
    <div className={`app${isRolesOpen ? ' app--roles-open' : ''}`}>
      <FloatingToolbar
        mode={mode}
        onModeChange={changeMode}
        isRolesOpen={isRolesOpen}
        onRolesToggle={() => setIsRolesOpen((isOpen) => !isOpen)}
        roles={roles}
        selectedRoleIds={script.value.roleIds}
        onToggleRole={toggleScriptRole}
        canUndo={script.canUndo}
        canRedo={script.canRedo}
        onUndo={script.undo}
        onRedo={script.redo}
      />
      {isRolesOpen && (
        <RolePanel
          roles={roles}
          selectedRoleIds={script.value.roleIds}
          onToggleRole={toggleScriptRole}
        />
      )}
      <Script
        script={script.value}
        roles={roles}
        mode={mode}
        onChange={(patch) => script.update((current) => ({ ...current, ...patch }))}
      />
    </div>
  )
}
