import type { ToastProps } from './ToastProps'

import './Toast.css'

/**
 * Всплывающее уведомление вверху экрана.
 */
export function Toast({ message }: ToastProps) {
  return <div className="toast" role="status">{message}</div>
}
