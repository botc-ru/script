import { act } from '@testing-library/react'

/**
 * Завершает CSS-анимацию элемента в тесте.
 *
 * В jsdom нет `AnimationEvent`, поэтому React слушает событие с префиксом, а не `animationend`.
 */
export function finishAnimation(element: Element) {
  act(() => {
    element.dispatchEvent(new Event('webkitAnimationEnd', { bubbles: true }))
  })
}
