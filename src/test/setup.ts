import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

Element.prototype.scrollIntoView = () => undefined
window.scrollTo = () => undefined

afterEach(() => {
  cleanup()
  localStorage.clear()
  window.history.replaceState(null, '', '/')
})
