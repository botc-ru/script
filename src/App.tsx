import { useState } from 'react'

import { RolePanel } from './components/roles/RolePanel'
import { Script } from './components/script/Script'
import { Toast } from './components/toast/Toast'
import { FloatingToolbar } from './components/toolbar/FloatingToolbar'
import { useRoles } from './contexts/roles/useRoles'
import { useHideOnScroll } from './hooks/useHideOnScroll'
import { useScript } from './hooks/useScript'
import { useToast } from './hooks/useToast'
import type { ScriptData } from './types/ScriptData'
import type { ScriptMode } from './types/ScriptMode'
import { resolveRoleIds } from './utils/resolveRoleIds'
import { toggleRole } from './utils/toggleRole'

import './App.css'

/**
 * Корневой компонент приложения: сценарий, панель ролей, плавающие кнопки и уведомления.
 *
 * Сценарий отрисовывается сразу, не дожидаясь загрузки ролей. Приложение всегда открывается
 * в режиме просмотра. На телефоне плавающие элементы скрываются при прокрутке вниз.
 */
export function App() {
  const roles = useRoles()
  const script = useScript()
  const { message, showToast } = useToast()
  const isControlsHidden = useHideOnScroll()
  const [mode, setMode] = useState<ScriptMode>('view')
  const [isRolesOpen, setIsRolesOpen] = useState(false)

  function changeMode(nextMode: ScriptMode) {
    setMode(nextMode)
    setIsRolesOpen(false)
  }

  function toggleScriptRole(roleId: string) {
    if (roles.status !== 'ready') return
    script.update((current) => toggleRole(current, roleId, roles.roles))
  }

  function importScript(imported: ScriptData) {
    const roleIds = roles.status === 'ready'
      ? resolveRoleIds(imported.roleIds, roles.roles)
      : imported.roleIds

    script.reset({ ...imported, roleIds })
    showToast('Сценарий загружен')
  }

  const className = [
    'app',
    isRolesOpen && 'app--roles-open',
    isControlsHidden && 'app--controls-hidden',
  ].filter(Boolean).join(' ')

  return (
    <div className={className}>
      <FloatingToolbar
        mode={mode}
        onModeChange={changeMode}
        isRolesOpen={isRolesOpen}
        onRolesOpenChange={setIsRolesOpen}
        roles={roles}
        script={script.value}
        onImport={importScript}
        onNotify={showToast}
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
      {message && <Toast message={message} />}
    </div>
  )
}
