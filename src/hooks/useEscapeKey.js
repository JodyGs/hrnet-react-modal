import { useEffect } from 'react'
import { useLatestRef } from './useLatestRef.js'

/**
 * Calls `onEscape` when the user presses the Escape key, while `enabled` is true.
 *
 * @param {((event: KeyboardEvent) => void) | undefined} onEscape
 * @param {boolean} enabled
 */
export function useEscapeKey(onEscape, enabled) {
  const onEscapeRef = useLatestRef(onEscape)

  useEffect(() => {
    if (!enabled) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onEscapeRef.current?.(event)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onEscapeRef])
}
