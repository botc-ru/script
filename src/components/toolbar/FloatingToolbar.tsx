import { Redo2, Search, Undo2, X } from 'lucide-react'
import { useState } from 'react'

import type { AppScreen } from '../../types/AppScreen'
import type { ScriptMode } from '../../types/ScriptMode'
import { ToolbarButton } from './button/ToolbarButton'
import type { FloatingToolbarProps } from './FloatingToolbarProps'
import { ToolbarModes } from './modes/ToolbarModes'
import type { SearchState } from './search/SearchState'
import { ToolbarSearch } from './search/ToolbarSearch'
import { ShareMenu } from './share/ShareMenu'

import './FloatingToolbar.css'

/**
 * Плавающие кнопки поверх страницы: на ПК вверху экрана, на телефоне внизу.
 *
 * Слева переход между режимами и экранами (`ToolbarModes`). На экране ролей на телефоне справа
 * остаётся только Поделиться: между кнопками находится поле поиска панели.
 *
 * Справа в редактировании отмена и повтор (если доступны) и поиск, в обоих режимах Поделиться.
 * Открытый поиск заменяет Поделиться крестиком, а на телефоне скрывает остальные кнопки.
 * В Макете отмены, повтора и поиска нет. Подробнее: `docs/toolbar.md`.
 */
export function FloatingToolbar({
  mode,
  onModeChange,
  screen,
  onScreenChange,
  roles,
  script,
  onImport,
  onNotify,
  onDownloadPdf,
  onToggleRole,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: FloatingToolbarProps) {
  const [search, setSearch] = useState<SearchState>('closed')
  const isSearchVisible = search !== 'closed'
  const hasScriptTools = mode === 'edit' && screen !== 'layout'

  function changeMode(nextMode: ScriptMode) {
    setSearch('closed')
    onModeChange(nextMode)
  }

  function changeScreen(nextScreen: AppScreen) {
    if (nextScreen === 'layout') setSearch('closed')
    onScreenChange(nextScreen)
  }

  const className = [
    'floating-toolbar',
    isSearchVisible && 'floating-toolbar--searching',
    screen === 'roles' && 'floating-toolbar--roles',
  ].filter(Boolean).join(' ')

  return (
    <div className={className}>
      <div className="floating-toolbar__modes floating-toolbar__secondary">
        <ToolbarModes
          mode={mode}
          screen={screen}
          onModeChange={changeMode}
          onScreenChange={changeScreen}
        />
      </div>

      <div className="floating-toolbar__actions">
        {hasScriptTools && (
          <div className="floating-toolbar__history floating-toolbar__secondary">
            {canUndo && <ToolbarButton icon={Undo2} label="Отменить" onClick={onUndo} />}
            {canRedo && <ToolbarButton icon={Redo2} label="Повторить" onClick={onRedo} />}
          </div>
        )}
        {isSearchVisible && (
          <ToolbarSearch
            roles={roles}
            selectedRoleIds={script.roleIds}
            isClosing={search === 'closing'}
            onToggleRole={onToggleRole}
            onClose={() => setSearch('closing')}
            onClosed={() => setSearch('closed')}
          />
        )}
        {hasScriptTools && !isSearchVisible && (
          <div className="floating-toolbar__search-button">
            <ToolbarButton icon={Search} label="Поиск" onClick={() => setSearch('open')} />
          </div>
        )}
        {isSearchVisible
          ? <ToolbarButton icon={X} label="Закрыть поиск" onClick={() => setSearch('closing')} />
          : (
              <ShareMenu
                script={script}
                onImport={onImport}
                onNotify={onNotify}
                onDownloadPdf={onDownloadPdf}
              />
            )}
      </div>
    </div>
  )
}
