import type { ToastProps } from './ToastProps'

import './Toast.css'

/**
 * Всплывающее уведомление вверху экрана. Выезжает при появлении,
 * а при `isLeaving` уезжает обратно и исчезает.
 */
export function Toast({ message, isLeaving }: ToastProps) {
  return (
    <div className={`toast${isLeaving ? ' toast--leaving' : ''}`} role="status">
      {message}
    </div>
  )
}
