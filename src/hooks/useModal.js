import { useCallback, useState } from 'react'

/**
 * Small helper holding the open / closed state of a modal.
 *
 * @example
 * const { isOpen, open, close } = useModal()
 * <button onClick={open}>Open</button>
 * <Modal isOpen={isOpen} onClose={close}>…</Modal>
 *
 * @param {boolean} [initialOpen=false] - initial state
 * @returns {{ isOpen: boolean, open: () => void, close: () => void, toggle: () => void }}
 */
export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((current) => !current), [])

  return { isOpen, open, close, toggle }
}
