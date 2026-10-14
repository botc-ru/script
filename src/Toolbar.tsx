import { ShareMenu } from './ShareMenu'
import { QuickAddRole } from './QuickAddRole'
import { RedoIcon, UndoIcon } from './icons'
import type { Mode } from './mode'
import type { Role, RolesById } from './types'
import './Toolbar.css'

const TABS: { mode: Mode; label: string }[] = [
  { mode: 'edit', label: 'Роли' },
  { mode: 'print', label: 'Макет' },
]

interface ToolbarProps {
  isEditRoute: boolean
  mode: Mode
  onTabClick: (mode: Mode) => void
  onEditClick: () => void
  onCopyJson: () => void
  onDownloadJson: () => void
  onCopyLink: () => void
  onDownloadPdf: () => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  roles: RolesById
  onSelectRole: (role: Role) => void
  onDeselectRole: (roleId: string) => void
  selectedRoleIds: Set<string>
}

export function Toolbar({
  isEditRoute,
  mode,
  onTabClick,
  onEditClick,
  onCopyJson,
  onDownloadJson,
  onCopyLink,
  onDownloadPdf,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  roles,
  onSelectRole,
  onDeselectRole,
  selectedRoleIds,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <nav className="toolbar__tabs">
        {isEditRoute ? (
          TABS.map((tab) => (
            <button
              key={tab.mode}
              type="button"
              className={mode === tab.mode ? 'active' : ''}
              onClick={() => onTabClick(tab.mode)}
            >
              {tab.label}
            </button>
          ))
        ) : (
          <button type="button" onClick={onEditClick}>
            Редактировать
          </button>
        )}
      </nav>

      {isEditRoute && (canUndo || canRedo) && (
        <div className="toolbar__history">
          {canUndo && (
            <button type="button" aria-label="Отменить" title="Отменить" onClick={onUndo}>
              <UndoIcon size={18} />
            </button>
          )}
          {canRedo && (
            <button type="button" aria-label="Повторить" title="Повторить" onClick={onRedo}>
              <RedoIcon size={18} />
            </button>
          )}
        </div>
      )}

      {isEditRoute && (
        <div className="toolbar__quick-add">
          <QuickAddRole
            roles={roles}
            onSelect={onSelectRole}
            onDeselect={onDeselectRole}
            selectedRoleIds={selectedRoleIds}
          />
        </div>
      )}

      <ShareMenu
        onCopyJson={onCopyJson}
        onDownloadJson={onDownloadJson}
        onCopyLink={onCopyLink}
        onDownloadPdf={onDownloadPdf}
      />
    </div>
  )
}
