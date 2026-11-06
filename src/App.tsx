import { useState } from 'react'

import { RolePanel } from './components/roles/RolePanel'
import { Script } from './components/script/Script'
import { Toast } from './components/toast/Toast'
import { FloatingToolbar } from './components/toolbar/FloatingToolbar'
import { useRoles } from './contexts/roles/useRoles'
import { useHideOnScroll } from './hooks/useHideOnScroll'
import { usePrintSettings } from './hooks/usePrintSettings'
import { useScript } from './hooks/useScript'
import { useToast } from './hooks/useToast'
import type { AppScreen } from './types/AppScreen'
import type { ScriptData } from './types/ScriptData'
import type { ScriptMode } from './types/ScriptMode'
import type { Team } from './types/Team'
import type { TeamFilter } from './types/TeamFilter'
import { downloadBlob } from './utils/downloadBlob'
import { hasPdfPages } from './utils/hasPdfPages'
import { loadScriptPdf } from './utils/loadScriptPdf'
import { resolveRoleIds } from './utils/resolveRoleIds'
import { toggleRole } from './utils/toggleRole'

import './App.css'

/**
 * Корневой компонент приложения: сценарий, панель ролей, плавающие кнопки и уведомления.
 *
 * Сценарий отрисовывается сразу, не дожидаясь загрузки ролей. Приложение всегда открывается
 * в режиме просмотра. На телефоне плавающие элементы скрываются при прокрутке вниз.
 *
 * Клик по заголовку секции открывает панель ролей с фильтром по этой команде.
 * При закрытии панели фильтр сбрасывается.
 */
export function App() {
  const roles = useRoles()
  const script = useScript()
  const { message, showToast } = useToast()
  const isControlsHidden = useHideOnScroll()
  const [printSettings] = usePrintSettings()
  const [mode, setMode] = useState<ScriptMode>('view')
  const [screen, setScreen] = useState<AppScreen>('script')
  const [rolesTeam, setRolesTeam] = useState<TeamFilter>('all')

  function changeScreen(nextScreen: AppScreen) {
    setScreen(nextScreen)
    if (nextScreen !== 'roles') setRolesTeam('all')
  }

  function changeMode(nextMode: ScriptMode) {
    setMode(nextMode)
    changeScreen('script')
  }

  function openTeamRoles(team: Team) {
    setRolesTeam(team)
    setScreen('roles')
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

  function downloadPdf() {
    if (roles.status !== 'ready') return

    showToast('Создаём PDF...')
    loadScriptPdf({ script: script.value, roles: roles.roles, settings: printSettings })
      .then((blob) => downloadBlob(`${script.value.name || 'script'}.pdf`, blob))
      .catch(() => showToast('Не удалось создать PDF'))
  }

  const canDownloadPdf = roles.status === 'ready' && hasPdfPages(printSettings)

  const className = [
    'app',
    screen === 'roles' && 'app--roles-open',
    isControlsHidden && 'app--controls-hidden',
  ].filter(Boolean).join(' ')

  return (
    <div className={className}>
      <FloatingToolbar
        mode={mode}
        onModeChange={changeMode}
        screen={screen}
        onScreenChange={changeScreen}
        roles={roles}
        script={script.value}
        onImport={importScript}
        onNotify={showToast}
        onDownloadPdf={canDownloadPdf ? downloadPdf : undefined}
        onToggleRole={toggleScriptRole}
        canUndo={script.canUndo}
        canRedo={script.canRedo}
        onUndo={script.undo}
        onRedo={script.redo}
      />
      {screen === 'roles' && (
        <RolePanel
          roles={roles}
          selectedRoleIds={script.value.roleIds}
          team={rolesTeam}
          onTeamChange={setRolesTeam}
          onToggleRole={toggleScriptRole}
        />
      )}
      <Script
        script={script.value}
        roles={roles}
        mode={mode}
        onChange={(patch) => script.update((current) => ({ ...current, ...patch }))}
        onSelectTeam={openTeamRoles}
      />
      {message && <Toast message={message} />}
    </div>
  )
}
