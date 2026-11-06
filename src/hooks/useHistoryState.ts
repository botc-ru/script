import { useState } from 'react'

const HISTORY_LIMIT = 50

interface History<T> {
  past: T[]
  present: T
  future: T[]
}

/**
 * Состояние с историей: отмена и повтор до 50 шагов, только в памяти.
 *
 * Новое значение очищает шаги для повтора, а `reset` заменяет значение и очищает всю историю.
 */
export function useHistoryState<T>(getInitial: () => T) {
  const [history, setHistory] = useState<History<T>>(() => ({
    past: [],
    present: getInitial(),
    future: [],
  }))

  function update(getNext: (current: T) => T) {
    setHistory(({ past, present }) => ({
      past: [...past, present].slice(-HISTORY_LIMIT),
      present: getNext(present),
      future: [],
    }))
  }

  function reset(value: T) {
    setHistory({ past: [], present: value, future: [] })
  }

  function undo() {
    setHistory(({ past, present, future }) => {
      const previous = past.at(-1)
      if (previous === undefined) return { past, present, future }
      return { past: past.slice(0, -1), present: previous, future: [present, ...future] }
    })
  }

  function redo() {
    setHistory(({ past, present, future }) => {
      const [next, ...rest] = future
      if (next === undefined) return { past, present, future }
      return { past: [...past, present], present: next, future: rest }
    })
  }

  return {
    value: history.present,
    update,
    reset,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  }
}
