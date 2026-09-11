import { useEffect, useState } from 'react'
import { useLatestRef } from './useLatestRef.js'

/**
 * Drives a CSS fade in / fade out for an element that must stay in the DOM
 * until its exit animation is over.
 *
 * - `isMounted`: the element must be rendered.
 * - `isVisible`: the element must be in its visible state (CSS class toggle).
 *
 * @param {boolean} isOpen - requested state
 * @param {object} options
 * @param {number} options.enterDuration - ms before `onEntered` is called
 * @param {number} options.exitDuration - ms before the element is unmounted
 * @param {() => void} [options.onEntered] - called once the enter animation is over
 * @param {() => void} [options.onExited] - called once the element has been unmounted
 * @returns {{ isMounted: boolean, isVisible: boolean }}
 */
export function useFadeTransition(isOpen, { enterDuration, exitDuration, onEntered, onExited }) {
  const [isMounted, setIsMounted] = useState(isOpen)
  const [hasEntered, setHasEntered] = useState(false)
  const callbacks = useLatestRef({ onEntered, onExited })

  // Mount right away when opening, during render, to avoid an extra empty commit.
  if (isOpen && !isMounted) setIsMounted(true)

  // Without animation there is nothing to wait for: visible as soon as it is open.
  const isVisible = isOpen && (hasEntered || enterDuration <= 0)

  useEffect(() => {
    if (isOpen) {
      // Wait for the hidden state to be painted, otherwise the browser skips the transition.
      const frame = requestAnimationFrame(() => setHasEntered(true))
      const timer = setTimeout(() => callbacks.current.onEntered?.(), enterDuration)
      return () => {
        cancelAnimationFrame(frame)
        clearTimeout(timer)
      }
    }

    if (!isMounted) return undefined

    const timer = setTimeout(() => {
      setHasEntered(false)
      setIsMounted(false)
      callbacks.current.onExited?.()
    }, exitDuration)
    return () => clearTimeout(timer)
  }, [isOpen, isMounted, enterDuration, exitDuration, callbacks])

  return { isMounted, isVisible }
}
