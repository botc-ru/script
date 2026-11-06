import { useEffect, useRef, useState } from 'react'

const SCROLL_THRESHOLD = 8

/**
 * Возвращает `true`, когда плавающие элементы нужно скрыть: при прокрутке страницы вниз.
 * При прокрутке вверх и в начале страницы они снова видны.
 *
 * Мелкие движения меньше порога не учитываются, как и пружинистая прокрутка за краями страницы.
 * Пока фокус в поле ввода, состояние не меняется: иначе поле уедет из-под открытой клавиатуры.
 */
export function useHideOnScroll(): boolean {
  const [isHidden, setIsHidden] = useState(false)
  const lastScroll = useRef(0)

  useEffect(() => {
    function handleScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const scroll = Math.min(Math.max(window.scrollY, 0), Math.max(maxScroll, 0))
      const delta = scroll - lastScroll.current

      if (scroll === 0) setIsHidden(false)
      if (Math.abs(delta) < SCROLL_THRESHOLD) return

      lastScroll.current = scroll
      if (document.activeElement instanceof HTMLInputElement) return
      setIsHidden(delta > 0 && scroll > 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return isHidden
}
