import { ShareMenu } from './ShareMenu'
import type { Mode } from './mode'
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

      <ShareMenu
        onCopyJson={onCopyJson}
        onDownloadJson={onDownloadJson}
        onCopyLink={onCopyLink}
        onDownloadPdf={onDownloadPdf}
      />
    </div>
  )
}
