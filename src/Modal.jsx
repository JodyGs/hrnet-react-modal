import { useId } from 'react'
import { createPortal } from 'react-dom'
import { useEscapeKey } from './hooks/useEscapeKey.js'
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
  modalClass,
  blockerClass,
  closeClass,
  ariaLabel,
  ariaDescribedBy,
  portalTarget,
}) {
  const titleId = useId()
  const overlayHandlers = useOverlayClick(onClose, clickClose)

  useEscapeKey(onClose, isOpen && escapeClose)

  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div className={classNames('hrnet-modal-blocker', blockerClass)} {...overlayHandlers}>
      <div
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
