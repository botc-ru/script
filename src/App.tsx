import { useState } from 'react'

import { Script } from './components/script/Script'
import { useRoles } from './contexts/roles/useRoles'
import type { ScriptData } from './types/ScriptData'
import type { ScriptMode } from './types/ScriptMode'

const SAMPLE_SCRIPT: ScriptData = {
  name: 'Пример',
  author: 'Автор',
  color: '#8b1e1e',
  roleIds: [
    'princess',
    'cannibal',
    'mortician_fall_of_rome',
    'goon',
    'wraith',
    'ceasar_fall_of_rome',
    'ferryman',
    'emperor_fall_of_rome',
  ],
}

/**
 * Корневой компонент приложения.
 *
 * Пока показывает пример сценария и временный переключатель режима.
 * Сценарий отрисовывается сразу, не дожидаясь загрузки ролей.
 */
export function App() {
  const roles = useRoles()
  const [script, setScript] = useState(SAMPLE_SCRIPT)
  const [mode, setMode] = useState<ScriptMode>('view')

  return (
    <>
      <button type="button" onClick={() => setMode((current) => (current === 'view' ? 'edit' : 'view'))}>
        {mode === 'view' ? 'Редактировать' : 'Просмотр'}
      </button>
      <Script
        script={script}
        roles={roles}
        mode={mode}
        onChange={(patch) => setScript((current) => ({ ...current, ...patch }))}
      />
    </>
  )
}
