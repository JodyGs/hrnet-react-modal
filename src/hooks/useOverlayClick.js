import { useRef } from 'react'

/**
 * Returns the mouse handlers to spread on the overlay so that a click on the
 * overlay itself (not on the dialog) calls `onClick`.
 *
 * The press must start AND end on the overlay: selecting text inside the dialog
 * and releasing the mouse outside of it must not close the modal.
 *
 * @param {(() => void) | undefined} onClick
 * @param {boolean} enabled
 * @returns {{ onMouseDown: (event: MouseEvent) => void, onClick: (event: MouseEvent) => void }}
 */
export function useOverlayClick(onClick, enabled) {
  const pressStartedOnOverlay = useRef(false)

  return {
    onMouseDown: (event) => {
      pressStartedOnOverlay.current = event.target === event.currentTarget
    },
    onClick: (event) => {
      const isOverlayClick = pressStartedOnOverlay.current && event.target === event.currentTarget
      pressStartedOnOverlay.current = false
      if (enabled && isOverlayClick) onClick?.()
    },
  }
}
