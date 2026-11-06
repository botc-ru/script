import { useState } from 'react'

import { Script } from './components/script/Script'
import { FloatingToolbar } from './components/toolbar/FloatingToolbar'
import { useRoles } from './contexts/roles/useRoles'
import { useHistoryState } from './hooks/useHistoryState'
import type { ScriptData } from './types/ScriptData'
import type { ScriptMode } from './types/ScriptMode'

import './App.css'

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
 * Корневой компонент приложения: сценарий и плавающие кнопки.
 *
 * Пока показывает пример сценария. Сценарий отрисовывается сразу, не дожидаясь загрузки ролей.
 */
export function App() {
  const roles = useRoles()
  const script = useHistoryState(SAMPLE_SCRIPT)
  const [mode, setMode] = useState<ScriptMode>('view')

  return (
    <div className="app">
      <FloatingToolbar
        mode={mode}
        onModeChange={setMode}
        canUndo={script.canUndo}
        canRedo={script.canRedo}
        onUndo={script.undo}
        onRedo={script.redo}
      />
      <Script
        script={script.value}
        roles={roles}
        mode={mode}
        onChange={(patch) => script.update((current) => ({ ...current, ...patch }))}
      />
    </div>
  )
}
