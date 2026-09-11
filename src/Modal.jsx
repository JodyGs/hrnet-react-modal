import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from './hooks/useBodyScrollLock.js'
import { useEscapeKey } from './hooks/useEscapeKey.js'
import { useFadeTransition } from './hooks/useFadeTransition.js'
import { useFocusTrap } from './hooks/useFocusTrap.js'
import { useOverlayClick } from './hooks/useOverlayClick.js'
import { classNames } from './utils/classNames.js'

/**
 * @typedef {object} ModalProps
 *
 * @property {boolean} isOpen
 *   Whether the modal is displayed. The component is controlled: the parent
 *   owns this state (see the `useModal` hook).
 * @property {() => void} [onClose]
 *   Called when the user asks to close the modal (close button, Escape key or
 *   overlay click). Set `isOpen` to `false` in it to actually close the modal.
 * @property {import('react').ReactNode} [children]
 *   Content of the dialog.
 * @property {import('react').ReactNode} [title]
 *   Optional heading rendered at the top of the dialog. It is also used as the
 *   accessible name of the dialog (`aria-labelledby`).
 * @property {boolean} [escapeClose=true]
 *   Allows closing the modal with the Escape key.
 * @property {boolean} [clickClose=true]
 *   Allows closing the modal by clicking on the dark overlay.
 * @property {boolean} [showClose=true]
 *   Displays the round "×" close button in the top right corner.
 * @property {string} [closeText='Close']
 *   Accessible label and tooltip of the close button (translate it here).
 * @property {number} [fadeDuration=0]
 *   Duration of the fade in / fade out animation, in milliseconds. `0` disables it.
 * @property {number} [fadeDelay=1]
 *   Delay before the dialog fades in, as a fraction of `fadeDuration`
 *   (with `1` the dialog appears once the overlay is fully displayed).
 * @property {string} [modalClass]
 *   Extra class name(s) added to the dialog box.
 * @property {string} [blockerClass]
 *   Extra class name(s) added to the overlay (named "blocker" in jquery-modal).
 * @property {string} [closeClass]
 *   Extra class name(s) added to the close button.
 * @property {boolean} [lockScroll=true]
 *   Prevents the page behind the modal from scrolling while it is open.
 * @property {string} [ariaLabel]
 *   Accessible name of the dialog when no `title` is provided.
 * @property {string} [ariaDescribedBy]
 *   Id of the element describing the dialog (`aria-describedby`).
 * @property {Element | null} [portalTarget]
 *   DOM element the modal is rendered into. Defaults to `document.body`.
 * @property {() => void} [onOpen]
 *   Called once the modal is fully displayed (after its fade in).
 *   Equivalent of the `modal:open` event of jquery-modal.
 * @property {() => void} [onAfterClose]
 *   Called once the modal is fully hidden and removed from the DOM.
 *   Equivalent of the `modal:after-close` event of jquery-modal.
 */

/**
 * Modal dialog — React replacement for the jQuery plugin `jquery-modal`.
 *
 * - rendered in a portal, above the page, with a dark overlay;
 * - accessible: `role="dialog"`, `aria-modal`, focus trap, focus restoration;
 * - closable with the close button, the Escape key or a click on the overlay;
 * - optional fade transitions and lifecycle callbacks;
 * - styled with plain CSS, customisable through class names or CSS variables.
 *
 * @example
 * const { isOpen, open, close } = useModal()
 *
 * <button onClick={open}>Save</button>
 * <Modal isOpen={isOpen} onClose={close} ariaLabel="Confirmation">
 *   <p>Employee Created!</p>
 * </Modal>
 *
 * @param {ModalProps} props
 * @returns {import('react').ReactPortal | null}
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
