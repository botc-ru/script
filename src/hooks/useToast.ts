import { useRef, useState } from 'react'

const TOAST_DURATION = 2500
const TOAST_LEAVE_DURATION = 200

/**
 * Текст всплывающего уведомления. Новое уведомление заменяет текущее и продлевает показ.
 * `isLeaving` включается перед удалением, чтобы уведомление успело плавно исчезнуть.
 */
export function useToast() {
  const [message, setMessage] = useState<string | null>(null)
  const [isLeaving, setIsLeaving] = useState(false)
  const timer = useRef<number>(undefined)

  function showToast(nextMessage: string) {
    window.clearTimeout(timer.current)
    setMessage(nextMessage)
    setIsLeaving(false)
    timer.current = window.setTimeout(() => {
      setIsLeaving(true)
      timer.current = window.setTimeout(() => setMessage(null), TOAST_LEAVE_DURATION)
    }, TOAST_DURATION)
  }

  return { message, isLeaving, showToast }
}
