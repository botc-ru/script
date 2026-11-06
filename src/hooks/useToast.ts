import { useRef, useState } from 'react'

const TOAST_DURATION = 2500

/** Текст всплывающего уведомления. Новое уведомление заменяет текущее и продлевает показ. */
export function useToast() {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<number>(undefined)

  function showToast(nextMessage: string) {
    window.clearTimeout(timer.current)
    setMessage(nextMessage)
    timer.current = window.setTimeout(() => setMessage(null), TOAST_DURATION)
  }

  return { message, showToast }
}
