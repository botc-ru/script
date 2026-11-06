import { Eye, FileText, Pencil, Redo2, Search, Share2, Undo2, Users, X } from 'lucide-react'
import { useState } from 'react'

import type { ScriptMode } from '../../types/ScriptMode'
import { ToolbarButton } from './button/ToolbarButton'
import type { FloatingToolbarProps } from './FloatingToolbarProps'
import { ModeMenu } from './mode-menu/ModeMenu'
import type { ModeAction } from './ModeAction'
import type { SearchState } from './search/SearchState'
import { ToolbarSearch } from './search/ToolbarSearch'

import './FloatingToolbar.css'

/**
 * Плавающие кнопки поверх страницы: на ПК вверху экрана, на телефоне внизу.
 *
 * Слева в просмотре одна кнопка Редактировать. В редактировании слева Просмотр, Роли и Макет:
 * на ПК это отдельные кнопки, на телефоне одна кнопка с меню. Справа в редактировании отмена
 * и повтор (если доступны) и поиск, в обоих режимах Поделиться. Открытый поиск заменяет
 * Поделиться крестиком, а на телефоне скрывает остальные кнопки.
 *
 * Роли, Макет и Поделиться пока неактивны: их функций ещё нет. Подробнее: `docs/toolbar.md`.
 */
export function FloatingToolbar({
  mode,
  onModeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: FloatingToolbarProps) {
  const [search, setSearch] = useState<SearchState>('closed')
  const isSearchVisible = search !== 'closed'
  const isEditing = mode === 'edit'

  function changeMode(nextMode: ScriptMode) {
    setSearch('closed')
    onModeChange(nextMode)
  }

  const editActions: ModeAction[] = [
    { icon: Eye, label: 'Просмотр', onClick: () => changeMode('view') },
    { icon: Users, label: 'Роли', disabled: true },
    { icon: FileText, label: 'Макет', disabled: true },
  ]

  return (
    <div className={`floating-toolbar${isSearchVisible ? ' floating-toolbar--searching' : ''}`}>
      <div className="floating-toolbar__modes floating-toolbar__secondary">
        {isEditing
          ? (
              <>
                <div className="floating-toolbar__desktop">
                  {editActions.map((action) => (
                    <ToolbarButton key={action.label} {...action} showLabel />
                  ))}
                </div>
                <div className="floating-toolbar__mobile">
                  <ModeMenu actions={editActions} />
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
            isClosing={search === 'closing'}
            onClose={() => setSearch('closing')}
            onClosed={() => setSearch('closed')}
          />
        )}
        {isEditing && !isSearchVisible && (
          <ToolbarButton icon={Search} label="Поиск" onClick={() => setSearch('open')} />
        )}
        {isSearchVisible
          ? <ToolbarButton icon={X} label="Закрыть поиск" onClick={() => setSearch('closing')} />
          : <ToolbarButton icon={Share2} label="Поделиться" disabled />}
      </div>
    </div>
  )
}
