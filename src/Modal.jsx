import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from './hooks/useBodyScrollLock.js'
import { useEscapeKey } from './hooks/useEscapeKey.js'
import { useFadeTransition } from './hooks/useFadeTransition.js'
import { useFocusTrap } from './hooks/useFocusTrap.js'
import { useOverlayClick } from './hooks/useOverlayClick.js'
import { classNames } from './utils/classNames.js'

/**
 * Modal dialog — React replacement for the jQuery plugin `jquery-modal`.
 *
 * The component is fully controlled: the parent owns the `isOpen` state and
 * receives a request to close it through `onClose`.
 */
export function Modal({
  isOpen,
  onClose,
  children,
  title,
  escapeClose = true,
  clickClose = true,
  showClose = true,
  closeText = 'Close',
  fadeDuration = 0,
  fadeDelay = 1,
  modalClass,
  blockerClass,
  closeClass,
  lockScroll = true,
  ariaLabel,
  ariaDescribedBy,
  portalTarget,
  onOpen,
  onAfterClose,
}) {
  const titleId = useId()
  const dialogRef = useRef(null)
  // Same timing as jquery-modal: the overlay fades in first, then the dialog
  // starts fading in after `fadeDuration * fadeDelay`. Both fade out together.
  const dialogDelay = fadeDuration * fadeDelay
  const { isMounted, isVisible } = useFadeTransition(isOpen, {
    enterDuration: fadeDuration + dialogDelay,
    exitDuration: fadeDuration,
    onEntered: onOpen,
    onExited: onAfterClose,
  })
  const overlayHandlers = useOverlayClick(onClose, isOpen && clickClose)

  useEscapeKey(onClose, isOpen && escapeClose)
  useFocusTrap(dialogRef, isOpen)
  useBodyScrollLock(isMounted && lockScroll)

  if (!isMounted || typeof document === 'undefined') return null

  return createPortal(
    <div
      className={classNames('hrnet-modal-blocker', isVisible && 'is-visible', blockerClass)}
      style={{
        '--hrnet-modal-fade-duration': `${fadeDuration}ms`,
        '--hrnet-modal-fade-delay': `${dialogDelay}ms`,
      }}
      {...overlayHandlers}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        className={classNames('hrnet-modal', modalClass)}
      >
        {title && (
          <h2 id={titleId} className="hrnet-modal__title">
            {title}
          </h2>
        )}
        {children}
        {showClose && (
          <button
            type="button"
            className={classNames('hrnet-modal__close', closeClass)}
            onClick={onClose}
            aria-label={closeText}
            title={closeText}
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
    </div>,
    portalTarget ?? document.body,
  )
}
