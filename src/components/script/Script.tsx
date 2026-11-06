import { ScriptHeader } from './header/ScriptHeader'
import type { ScriptProps } from './ScriptProps'
import { ScriptSections } from './sections/ScriptSections'

import './Script.css'

/**
 * Сценарий: заголовок с названием и автором, ниже секции с ролями.
 *
 * Заголовок показывается сразу. Секции появляются после загрузки ролей, а до этого на их месте
 * видно сообщение о загрузке или об ошибке.
 *
 * Режимы:
 * - `view`: только просмотр.
 * - `edit`: можно менять название, автора и цвет. Клик по роли удаляет её из сценария,
 *   перетаскивание меняет порядок ролей внутри секции, клик по заголовку секции вызывает
 *   `onSelectTeam`.
 */
export function Script({ script, roles, mode, onChange, onSelectTeam }: ScriptProps) {
  return (
    <div className="script">
      <ScriptHeader script={script} mode={mode} onChange={onChange} />

      {roles.status === 'loading' && <p>Загрузка ролей...</p>}
      {roles.status === 'error' && <p>Не удалось загрузить роли</p>}
      {roles.status === 'ready' && (
        <ScriptSections
          script={script}
          roles={roles.roles}
          mode={mode}
          onChange={onChange}
          onSelectTeam={onSelectTeam}
        />
      )}
    </div>
  )
}
