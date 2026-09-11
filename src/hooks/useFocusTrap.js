import { useEffect } from 'react'
import { getFocusableElements } from '../utils/getFocusableElements.js'

/**
 * While `active` is true:
 * - moves the focus into the container (first focusable element, or the container itself);
 * - keeps Tab / Shift+Tab cycling inside the container;
 * - gives the focus back to the previously focused element when deactivated.
 *
 * @param {{ current: HTMLElement | null }} containerRef
 * @param {boolean} active
 */
export function useFocusTrap(containerRef, active) {
  useEffect(() => {
    const container = containerRef.current
    if (!active || !container) return undefined

    const previouslyFocused = document.activeElement
    const [firstFocusable] = getFocusableElements(container)
    ;(firstFocusable ?? container).focus()

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return

      const focusable = getFocusableElements(container)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const current = document.activeElement

      if (!first) {
        event.preventDefault()
        container.focus()
      } else if (!container.contains(current)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && (current === first || current === container)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [containerRef, active])
}
