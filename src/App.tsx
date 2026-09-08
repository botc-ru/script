import { lazy, Suspense, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRoles } from './useRoles'
import { Toolbar } from './Toolbar'
import { ReadOnlyScreen } from './ReadOnlyScreen'
import { RolePanel, type TeamFilter } from './RolePanel'
import { ScriptPanel } from './ScriptPanel'
import { PrintSettingsPanel } from './PrintSettingsPanel'
import { Toast } from './Toast'
import { usePrintPdf } from './usePrintPdf'
import { usePath } from './usePath'
import { EDIT_PATH, isEditPath } from './routes'
import type { Mode } from './mode'
import { DEFAULT_PRINT_SETTINGS, type PrintSettings } from './print'
import { compareByAso } from './aso'
import { loadScript, saveScript } from './scriptStorage'
import { buildScriptLink, buildScriptQuery, readScriptFromLink } from './scriptLink'
import { downloadScriptJson, copyScriptJson } from './scriptExport'
import { downloadScriptPdf } from './pdf/pdfExport'
import type { ScriptData } from './scriptModel'
import type { Role, RolesById } from './types'
import './App.css'

const PdfPreview = lazy(() => import('./PdfPreview').then((m) => ({ default: m.PdfPreview })))

const linkScript = readScriptFromLink()
const savedScript = linkScript ?? loadScript()
const openedFromLink = linkScript !== null

const MAX_CONTENT_WIDTH = 760
const ROLE_PANEL_WIDTH = 180

function copyScriptJsonWhenFocused(script: ScriptData): Promise<void> {
  return copyScriptJson(script).catch((error) => {
    if (document.hasFocus()) throw error

    return new Promise<void>((resolve, reject) => {
      function onFocus() {
        window.removeEventListener('focus', onFocus)
        copyScriptJson(script).then(resolve, reject)
      }
      window.addEventListener('focus', onFocus)
    })
  })
}

function replaceUrlQuery(query: string) {
  window.history.replaceState(
    null,
    '',
    window.location.pathname + (query ? `?${query}` : '') + window.location.hash,
  )
}

function App() {
  const { roles, loading, error } = useRoles()
  const [path, navigate] = usePath()
  const isEditRoute = isEditPath(path)
  const [script, setScript] = useState<ScriptData>(savedScript)
  const [mode, setMode] = useState<Mode>(() =>
    window.innerWidth > MAX_CONTENT_WIDTH + ROLE_PANEL_WIDTH ? 'edit' : 'view',
  )
  const [teamFilter, setTeamFilter] = useState<TeamFilter>('all')
  const [printSettings, setPrintSettings] = useState<PrintSettings>(DEFAULT_PRINT_SETTINGS)
  const [toast, setToast] = useState<{ message: string; key: number } | null>(null)

  function showToast(message: string) {
    const key = Date.now()
    setToast({ message, key })
    window.setTimeout(() => {
      setToast((current) => (current?.key === key ? null : current))
    }, 2500)
  }

  useEffect(() => {
    document.title = script.name || 'Редактор сценариев'
  }, [script.name])

  useEffect(() => {
    saveScript(script)
  }, [script])

  useEffect(() => {
    if (!openedFromLink) return
    const action = new URLSearchParams(window.location.search).get('action')
    const query = buildScriptQuery(script)
    replaceUrlQuery(action ? `action=${action}${query ? '&' : ''}${query}` : query)
  }, [script])

  useEffect(() => {
    function handleResize() {
      const isWide = window.innerWidth > MAX_CONTENT_WIDTH + ROLE_PANEL_WIDTH + 16 * 3
      setMode((current) => {
        if (current === 'view' && isWide) return 'edit'
        if (current === 'edit' && !isWide) return 'view'
        return current
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  function handleSelectTeamFromScript(team: TeamFilter) {
    setTeamFilter(team)
    setMode('edit')
  }

  function handleDownloadPdf() {
    downloadScriptPdf({ script, roles: scriptRoles, allRoles: roles, settings: printSettings }).catch(() => {
      window.alert('Не удалось создать PDF')
    })
  }

  function handleCopyLink() {
    const link = buildScriptLink(script)
    navigator.clipboard
      .writeText(link)
      .then(() => showToast('Ссылка скопирована в буфер обмена'))
      .catch(() => {
        window.prompt('Скопируйте ссылку:', link)
      })
  }

  useEffect(() => {
    if (loading) return
    const action = new URLSearchParams(window.location.search).get('action')
    if (action !== 'pdf' && action !== 'json') return

    if (action === 'pdf') {
      handleDownloadPdf()
    } else {
      copyScriptJsonWhenFocused(script)
        .then(() => showToast('JSON скопирован в буфер обмена'))
        .catch(() => {})
    }

    replaceUrlQuery(openedFromLink ? buildScriptQuery(script) : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const printBlob = usePrintPdf({
    script,
    scriptRoles,
    allRoles: roles,
    rolesLoading: loading,
    settings: printSettings,
    active: mode === 'print',
  })

  const isPrintMode = mode === 'print'
  const sidebarOpen = mode !== 'view'

  return (
    <div className="page" style={{ '--max-content-width': `${MAX_CONTENT_WIDTH}px` } as CSSProperties}>
      <Toolbar
        isEditRoute={isEditRoute}
        mode={mode}
        onTabClick={handleTabClick}
        onEditClick={() => navigate(EDIT_PATH)}
        onCopyJson={() =>
          copyScriptJson(script)
            .then(() => showToast('JSON скопирован в буфер обмена'))
            .catch(() => {})
        }
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
        <div
          className={`app${sidebarOpen ? ' app--sidebar-open' : ''}${isPrintMode ? ' app--print' : ''}`}
        >
          <div className={`side-panel${sidebarOpen ? '' : ' side-panel--collapsed'}`}>
            {isPrintMode ? (
              <PrintSettingsPanel
                settings={printSettings}
                onChange={setPrintSettings}
                onDownloadPdf={handleDownloadPdf}
              />
            ) : (
              <RolePanel
                roles={selectableRoles}
                loading={loading}
                error={error}
                onSelect={addToScript}
                selectedRoleIds={scriptRoleIds}
                onDeselect={removeFromScript}
                teamFilter={teamFilter}
                onTeamFilterChange={setTeamFilter}
              />
            )}
          </div>

          <div className="main-panel">
            <div className={`script-panel-container${isPrintMode ? ' main-panel__slot--hidden' : ''}`}>
              <ScriptPanel
                roles={scriptRoles}
                allRoles={roles}
                script={script}
                onScriptChange={updateScript}
                onRemove={removeFromScript}
                onSelectTeam={handleSelectTeamFromScript}
                onReorder={reorderScript}
              />
            </div>

            <div className={`main-panel__preview${isPrintMode ? '' : ' main-panel__slot--hidden'}`}>
              {printBlob && (
                <Suspense fallback={<p>Загрузка просмотрщика...</p>}>
                  <PdfPreview blob={printBlob} />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && <Toast key={toast.key} message={toast.message} />}
    </div>
  )
}

export default App
