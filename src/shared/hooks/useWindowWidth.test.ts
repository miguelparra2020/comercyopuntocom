import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWindowWidth } from './useWindowWidth'

describe('useWindowWidth', () => {
  let originalInnerWidth: number

  beforeEach(() => {
    originalInnerWidth = window.innerWidth
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: originalInnerWidth })
  })

  it('returns the current window.innerWidth', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1280 })
    const { result } = renderHook(() => useWindowWidth())
    expect(result.current).toBe(1280)
  })

  it('updates when the window is resized', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 800 })
    const { result } = renderHook(() => useWindowWidth())
    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 400 })
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current).toBe(400)
  })
})
