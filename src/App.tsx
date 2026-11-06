import { useState } from 'react'

import { Script } from './components/script/Script'
import { FloatingToolbar } from './components/toolbar/FloatingToolbar'
import { useRoles } from './contexts/roles/useRoles'
import { useScript } from './hooks/useScript'
import type { ScriptMode } from './types/ScriptMode'
import { toggleRole } from './utils/toggleRole'

import './App.css'

/**
 * Корневой компонент приложения: сценарий и плавающие кнопки.
 *
 * Сценарий отрисовывается сразу, не дожидаясь загрузки ролей. Приложение всегда открывается
 * в режиме просмотра.
 */
export function App() {
  const roles = useRoles()
  const script = useScript()
  const [mode, setMode] = useState<ScriptMode>('view')

  return (
    <div className="app">
      <FloatingToolbar
        mode={mode}
        onModeChange={setMode}
        roles={roles}
        selectedRoleIds={script.value.roleIds}
        onToggleRole={(roleId) => script.update((current) => toggleRole(current, roleId))}
        canUndo={script.canUndo}
        canRedo={script.canRedo}
        onUndo={script.undo}
        onRedo={script.redo}
      />
      <Script
        script={script.value}
        roles={roles}
        mode={mode}
        onChange={(patch) => script.update((current) => ({ ...current, ...patch }))}
      />
    </div>
  )
}
