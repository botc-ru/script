import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useHideOnScroll } from './useHideOnScroll'

function scrollTo(y: number) {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
    window.dispatchEvent(new Event('scroll'))
  })
}

describe('useHideOnScroll', () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 5000,
      configurable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    document.body.replaceChildren()
  })

  it('скрывает при прокрутке вниз и показывает при прокрутке вверх', () => {
    const { result } = renderHook(() => useHideOnScroll())
    expect(result.current).toBe(false)

    scrollTo(100)
    expect(result.current).toBe(true)

    scrollTo(50)
    expect(result.current).toBe(false)
  })

  it('не реагирует на движение меньше порога', () => {
    const { result } = renderHook(() => useHideOnScroll())

    scrollTo(100)
    scrollTo(95)

    expect(result.current).toBe(true)
  })

  it('показывает в начале страницы даже при малом движении', () => {
    const { result } = renderHook(() => useHideOnScroll())

    scrollTo(5)
    scrollTo(100)
    scrollTo(0)

    expect(result.current).toBe(false)
  })

  it('не считает пружинистую прокрутку за нижним краем движением вверх', () => {
    const { result } = renderHook(() => useHideOnScroll())
    const end = 5000 - window.innerHeight

    scrollTo(end)
    scrollTo(end + 60)
    scrollTo(end + 10)

    expect(result.current).toBe(true)
  })

  it('не скрывает, пока фокус в поле ввода', () => {
    const { result } = renderHook(() => useHideOnScroll())
    const input = document.createElement('input')
    document.body.append(input)
    input.focus()

    scrollTo(100)

    expect(result.current).toBe(false)
  })
})
