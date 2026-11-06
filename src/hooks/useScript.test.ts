import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DEFAULT_SCRIPT } from '../utils/defaultScript'
import { loadScript, saveScript } from '../utils/scriptStorage'
import { useScript } from './useScript'

describe('useScript', () => {
  it('без ссылки и сохранения открывает пустой сценарий', () => {
    const { result } = renderHook(() => useScript())

    expect(result.current.value).toEqual(DEFAULT_SCRIPT)
  })

  it('без ссылки открывает последний сохранённый сценарий', () => {
    saveScript({ ...DEFAULT_SCRIPT, name: 'Сохранённый' })

    const { result } = renderHook(() => useScript())

    expect(result.current.value.name).toBe('Сохранённый')
  })

  it('ссылка важнее сохранённого сценария и становится последним открытым', () => {
    saveScript({ ...DEFAULT_SCRIPT, name: 'Сохранённый' })
    window.history.replaceState(null, '', '/script/?title=Из%20ссылки')

    const { result } = renderHook(() => useScript())

    expect(result.current.value.name).toBe('Из ссылки')
    expect(loadScript()?.name).toBe('Из ссылки')
  })

  it('сохраняет изменения', () => {
    const { result } = renderHook(() => useScript())

    act(() => result.current.update((script) => ({ ...script, name: 'Новое' })))

    expect(loadScript()?.name).toBe('Новое')
  })

  it('обновляет адрес сценария, открытого по ссылке', () => {
    window.history.replaceState(null, '', '/script/?title=Старое')
    const { result } = renderHook(() => useScript())

    act(() => result.current.update((script) => ({ ...script, name: 'Новое' })))

    expect(new URLSearchParams(window.location.search).get('title')).toBe('Новое')
    expect(window.location.pathname).toBe('/script/')
  })

  it('не добавляет параметры в адрес без ссылки', () => {
    window.history.replaceState(null, '', '/script/')
    const { result } = renderHook(() => useScript())

    act(() => result.current.update((script) => ({ ...script, name: 'Новое' })))

    expect(window.location.search).toBe('')
  })
})
