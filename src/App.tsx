import { useEffect, useMemo, useState } from 'react'
import { useRoles } from './useRoles'
import { Toolbar } from './Toolbar'
import { ReadOnlyScreen } from './ReadOnlyScreen'
import { EditScreen } from './EditScreen'
import { PrintScreen } from './PrintScreen'
import { usePath } from './usePath'
import { EDIT_PATH, isEditPath } from './routes'
import type { TeamFilter } from './RolePanel'
import type { Mode } from './mode'
import { DEFAULT_PRINT_SETTINGS, type PrintSettings } from './print'
import { compareByAso } from './aso'
import { loadScript, saveScript } from './scriptStorage'
import { buildScriptLink, readScriptFromLink } from './scriptLink'
import { downloadScriptJson, copyScriptJson } from './scriptExport'
import { downloadScriptPdf } from './pdf/pdfExport'
import type { ScriptData } from './scriptModel'
import type { Role, RolesById } from './types'
import './App.css'

const savedScript = readScriptFromLink() ?? loadScript()

function App() {
  const { roles, loading, error } = useRoles()
  const [path, navigate] = usePath()
  const isEditRoute = isEditPath(path)
  const [script, setScript] = useState<ScriptData>(savedScript)
  const [mode, setMode] = useState<Mode>('edit')
  const [teamFilter, setTeamFilter] = useState<TeamFilter>('all')
  const [printSettings, setPrintSettings] = useState<PrintSettings>(DEFAULT_PRINT_SETTINGS)

  useEffect(() => {
    document.title = script.name || 'Редактор сценариев'
  }, [script.name])

  useEffect(() => {
    saveScript(script)
  }, [script])

  function updateScript(patch: Partial<ScriptData>) {
    setScript((current) => ({ ...current, ...patch }))
  }

  const selectableRoles = useMemo<RolesById>(
    () => Object.fromEntries(Object.entries(roles).filter(([, role]) => role.team)),
    [roles],
  )

  const scriptRoles = useMemo(
    () => script.roleIds.filter((id) => roles[id]).map((id) => roles[id]),
    [script.roleIds, roles],
  )
  const scriptRoleIds = useMemo(() => new Set(script.roleIds), [script.roleIds])

  function addToScript(role: Role) {
    if (script.roleIds.includes(role.id)) return
    const insertBefore = script.roleIds.findIndex(
      (id) => roles[id]?.team === role.team && compareByAso(role, roles[id]) < 0,
    )
    const roleIds =
      insertBefore === -1
        ? [...script.roleIds, role.id]
        : [...script.roleIds.slice(0, insertBefore), role.id, ...script.roleIds.slice(insertBefore)]
    updateScript({ roleIds })
  }

  function removeFromScript(roleId: string) {
    updateScript({ roleIds: script.roleIds.filter((id) => id !== roleId) })
  }

  function reorderScript(draggedId: string, targetId: string) {
    if (draggedId === targetId) return
    const remaining = script.roleIds.filter((id) => id !== draggedId)
    const to = remaining.indexOf(targetId)
    remaining.splice(to, 0, draggedId)
    updateScript({ roleIds: remaining })
  }

  function handleTabClick(clickedMode: Mode) {
    setMode((current) => (current === clickedMode ? 'view' : clickedMode))
  }

  function handleDownloadPdf() {
    downloadScriptPdf({ script, roles: scriptRoles, allRoles: roles, settings: printSettings }).catch(() => {
      window.alert('Не удалось создать PDF')
    })
  }

  function handleCopyLink() {
    const link = buildScriptLink(script)
    navigator.clipboard.writeText(link).catch(() => {
      window.prompt('Скопируйте ссылку:', link)
    })
  }

  return (
    <div className="page">
      <Toolbar
        isEditRoute={isEditRoute}
        mode={mode}
        onTabClick={handleTabClick}
        onEditClick={() => navigate(EDIT_PATH)}
        onCopyJson={() => copyScriptJson(script).catch(() => {})}
        onDownloadJson={() => downloadScriptJson(script)}
        onCopyLink={handleCopyLink}
        onDownloadPdf={handleDownloadPdf}
        roles={selectableRoles}
        onSelectRole={addToScript}
        onDeselectRole={removeFromScript}
        selectedRoleIds={scriptRoleIds}
      />

      {!isEditRoute && <ReadOnlyScreen scriptRoles={scriptRoles} allRoles={roles} script={script} />}

      {isEditRoute && (
        <div hidden={mode === 'print'} className="page-body">
          <EditScreen
            roles={selectableRoles}
            loading={loading}
            error={error}
            scriptRoles={scriptRoles}
            showRolePanel={mode === 'edit'}
            teamFilter={teamFilter}
            onTeamFilterChange={setTeamFilter}
            onSelectRole={addToScript}
            script={script}
            onScriptChange={updateScript}
            onRemove={removeFromScript}
            onReorder={reorderScript}
          />
        </div>
      )}

      {isEditRoute && (
        <div hidden={mode !== 'print'} className="page-body">
          <PrintScreen
            scriptRoles={scriptRoles}
            allRoles={roles}
            rolesLoading={loading}
            script={script}
            settings={printSettings}
            active={mode === 'print'}
            onSettingsChange={setPrintSettings}
            onDownloadPdf={handleDownloadPdf}
          />
        </div>
      )}
    </div>
  )
}

export default App
