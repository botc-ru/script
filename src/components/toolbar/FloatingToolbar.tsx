import {
  Eye,
  FileText,
  Menu,
  Pencil,
  Redo2,
  ScrollText,
  Search,
  Undo2,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'

import type { ScriptMode } from '../../types/ScriptMode'
import { ToolbarButton } from './button/ToolbarButton'
import type { FloatingToolbarProps } from './FloatingToolbarProps'
import { PopupMenu } from './menu/PopupMenu'
import type { ModeAction } from './ModeAction'
import type { SearchState } from './search/SearchState'
import { ToolbarSearch } from './search/ToolbarSearch'
import { ShareMenu } from './share/ShareMenu'

import './FloatingToolbar.css'

/**
 * Плавающие кнопки поверх страницы: на ПК вверху экрана, на телефоне внизу.
 *
 * Слева в просмотре одна кнопка Редактировать. В редактировании слева Просмотр, Роли и Макет:
 * на ПК это отдельные кнопки, на телефоне меню с постоянным порядком пунктов: Просмотр, Сценарий,
 * Роли, Макет. На экране ролей на телефоне справа остаётся только Поделиться: между кнопками
 * находится поле поиска панели.
 *
 * Справа в редактировании отмена и повтор (если доступны) и поиск, в обоих режимах Поделиться.
 * Открытый поиск заменяет Поделиться крестиком, а на телефоне скрывает остальные кнопки.
 *
 * Макет пока неактивен: его функции ещё нет. Подробнее: `docs/toolbar.md`.
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
  const isEditing = mode === 'edit'
  const isRolesOpen = screen === 'roles'

  function changeMode(nextMode: ScriptMode) {
    setSearch('closed')
    onModeChange(nextMode)
  }

  const viewAction: ModeAction = {
    icon: Eye,
    label: 'Просмотр',
    onClick: () => changeMode('view'),
  }
  const layoutAction: ModeAction = { icon: FileText, label: 'Макет', disabled: true }
  const rolesAction: ModeAction = { icon: Users, label: 'Роли', isActive: isRolesOpen }
  const menuActions: ModeAction[] = [
    viewAction,
    {
      icon: ScrollText,
      label: 'Сценарий',
      isActive: screen === 'script',
      onClick: () => onScreenChange('script'),
    },
    { ...rolesAction, onClick: () => onScreenChange('roles') },
    layoutAction,
  ]

  const className = [
    'floating-toolbar',
    isSearchVisible && 'floating-toolbar--searching',
    isRolesOpen && 'floating-toolbar--roles',
  ].filter(Boolean).join(' ')

  return (
    <div className={className}>
      <div className="floating-toolbar__modes floating-toolbar__secondary">
        {isEditing
          ? (
              <>
                <div className="floating-toolbar__desktop">
                  <ToolbarButton {...viewAction} showLabel />
                  <ToolbarButton
                    {...rolesAction}
                    showLabel
                    onClick={() => onScreenChange(isRolesOpen ? 'script' : 'roles')}
                  />
                  <ToolbarButton {...layoutAction} showLabel />
                </div>
                <div className="floating-toolbar__mobile">
                  <PopupMenu icon={Menu} label="Меню" groups={[{ actions: menuActions }]} align="left" />
                </div>
              </>
            )
          : (
              <ToolbarButton
                icon={Pencil}
                label="Редактировать"
                showLabel
                onClick={() => changeMode('edit')}
              />
            )}
      </div>

      <div className="floating-toolbar__actions">
        {isEditing && (
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
        {isEditing && !isSearchVisible && (
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
