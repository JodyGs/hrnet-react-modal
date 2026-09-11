import { useEffect } from 'react'

/**
 * Prevents the page behind the modal from scrolling while `active` is true.
 * The width of the removed scrollbar is added as padding so that the page
 * content does not shift horizontally (no layout shift).
 *
 * @param {boolean} active
 */
export function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined

    const { body, documentElement } = document
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      const currentPadding = parseFloat(window.getComputedStyle(body).paddingRight) || 0
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
    }

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
    }
  }, [active])
}
