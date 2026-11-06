import type { ScriptHeaderProps } from './ScriptHeaderProps'

import './ScriptHeader.css'

/**
 * Заголовок сценария: название, автор и цвет.
 *
 * В режиме `view` показывает значения с цветной полосой слева: пустое название заменяется
 * на «Без названия», пустой автор скрывается. В режиме `edit` показывает поля ввода,
 * изменения приходят в `onChange`.
 */
export function ScriptHeader({ script, mode, onChange }: ScriptHeaderProps) {
  if (mode === 'view') {
    return (
      <header className="script-header script-header--view" style={{ borderColor: script.color }}>
        <div>
          <h1 className="script-header__name">{script.name || 'Без названия'}</h1>
          {script.author && <p className="script-header__author">{script.author}</p>}
        </div>
      </header>
    )
  }

  return (
    <header className="script-header">
      <input
        type="color"
        className="script-header__color"
        title="Цвет сценария"
        value={script.color}
        onChange={(event) => onChange?.({ color: event.target.value })}
      />
      <div className="script-header__fields">
        <input
          type="text"
          className="script-header__name"
          placeholder="Название сценария"
          value={script.name}
          onChange={(event) => onChange?.({ name: event.target.value })}
        />
        <input
          type="text"
          className="script-header__author"
          placeholder="Автор"
          value={script.author}
          onChange={(event) => onChange?.({ author: event.target.value })}
        />
      </div>
    </header>
  )
}
