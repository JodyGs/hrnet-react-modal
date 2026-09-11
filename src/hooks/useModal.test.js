import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useModal } from './useModal.js'

describe('useModal', () => {
  it('is closed by default', () => {
    const { result } = renderHook(() => useModal())
    expect(result.current.isOpen).toBe(false)
  })

  it('accepts an initial state', () => {
    const { result } = renderHook(() => useModal(true))
    expect(result.current.isOpen).toBe(true)
  })

  it('opens, closes and toggles', () => {
    const { result } = renderHook(() => useModal())

    act(() => result.current.open())
    expect(result.current.isOpen).toBe(true)
    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(true)
  })

  it('returns stable functions between renders', () => {
    const { result, rerender } = renderHook(() => useModal())
    const { open, close, toggle } = result.current

    act(() => result.current.open())
    rerender()

    expect(result.current.open).toBe(open)
    expect(result.current.close).toBe(close)
    expect(result.current.toggle).toBe(toggle)
  })
})
