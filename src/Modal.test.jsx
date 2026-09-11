import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal.jsx'

function renderModal(props = {}) {
  const onClose = vi.fn()
  const utils = render(
    <Modal isOpen onClose={onClose} ariaLabel="Confirmation" {...props}>
      <p>Employee Created!</p>
    </Modal>,
  )
  return { onClose, ...utils }
}

/** Real-life usage: a trigger button owning the open state. */
function ModalHarness(props) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New employee" {...props}>
        <input aria-label="First name" />
        <button type="button">Confirm</button>
      </Modal>
    </>
  )
}

const getBlocker = () => document.querySelector('.hrnet-modal-blocker')

describe('Modal — rendering', () => {
  it('renders nothing when isOpen is false', () => {
    renderModal({ isOpen: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders its content in a modal dialog attached to document.body', () => {
    const { container } = renderModal()
    const dialog = screen.getByRole('dialog', { name: 'Confirmation' })

    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveTextContent('Employee Created!')
    expect(container).not.toContainElement(dialog)
    expect(document.body).toContainElement(dialog)
  })

  it('is labelled by its title when one is provided', () => {
    renderModal({ title: 'New employee' })
    expect(screen.getByRole('dialog', { name: 'New employee' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'New employee' })).toBeInTheDocument()
  })

  it('links the description with aria-describedby', () => {
    render(
      <Modal isOpen onClose={() => {}} ariaLabel="Info" ariaDescribedBy="desc">
        <p id="desc">Saved.</p>
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toHaveAccessibleDescription('Saved.')
  })

  it('renders into a custom portal target', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    renderModal({ portalTarget: target })

    expect(target).toContainElement(screen.getByRole('dialog'))
    target.remove()
  })

  it('applies the custom class names', () => {
    renderModal({ modalClass: 'my-modal', blockerClass: 'my-blocker', closeClass: 'my-close' })

    expect(screen.getByRole('dialog')).toHaveClass('hrnet-modal', 'my-modal')
    expect(getBlocker()).toHaveClass('hrnet-modal-blocker', 'my-blocker')
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('hrnet-modal__close', 'my-close')
  })

  it('uses closeText as the accessible name of the close button', () => {
    renderModal({ closeText: 'Fermer' })
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
  })

  it('hides the close button when showClose is false', () => {
    renderModal({ showClose: false })
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })
})

describe('Modal — closing', () => {
  it('calls onClose when the close button is clicked', async () => {
    const { onClose } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose on Escape', async () => {
    const { onClose } = renderModal()
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('ignores Escape when escapeClose is false', async () => {
    const { onClose } = renderModal({ escapeClose: false })
    await userEvent.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when the overlay is clicked', async () => {
    const { onClose } = renderModal()
    await userEvent.click(getBlocker())
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when the dialog itself is clicked', async () => {
    const { onClose } = renderModal()
    await userEvent.click(screen.getByText('Employee Created!'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not close when a press starts in the dialog and ends on the overlay', () => {
    const { onClose } = renderModal()
    fireEvent.mouseDown(screen.getByRole('dialog'))
    fireEvent.click(getBlocker())
    expect(onClose).not.toHaveBeenCalled()
  })

  it('ignores overlay clicks when clickClose is false', async () => {
    const { onClose } = renderModal({ clickClose: false })
    await userEvent.click(getBlocker())
    expect(onClose).not.toHaveBeenCalled()
  })
})

describe('Modal — focus management', () => {
  it('moves the focus to the first focusable element when opened', async () => {
    render(<ModalHarness />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('textbox', { name: 'First name' })).toHaveFocus()
  })

  it('focuses the dialog itself when it has no focusable element', () => {
    renderModal({ showClose: false })
    expect(screen.getByRole('dialog')).toHaveFocus()
  })

  it('keeps Tab and Shift+Tab inside the dialog', async () => {
    render(<ModalHarness />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('textbox', { name: 'First name' })).toHaveFocus()
    await userEvent.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
  })

  it('gives the focus back to the trigger once closed', async () => {
    render(<ModalHarness />)
    const trigger = screen.getByRole('button', { name: 'Open' })
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })
})

describe('Modal — scroll lock', () => {
  it('locks the body scroll while open and restores it after closing', async () => {
    const { rerender, onClose } = renderModal()
    expect(document.body.style.overflow).toBe('hidden')

    rerender(
      <Modal isOpen={false} onClose={onClose} ariaLabel="Confirmation">
        <p>Employee Created!</p>
      </Modal>,
    )
    await waitFor(() => expect(document.body.style.overflow).toBe(''))
  })

  it('leaves the body untouched when lockScroll is false', () => {
    renderModal({ lockScroll: false })
    expect(document.body.style.overflow).toBe('')
  })
})

describe('Modal — fade transition', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('exposes the durations as CSS variables', () => {
    renderModal({ fadeDuration: 200, fadeDelay: 0.5 })
    expect(getBlocker().style.getPropertyValue('--hrnet-modal-fade-duration')).toBe('200ms')
    expect(getBlocker().style.getPropertyValue('--hrnet-modal-fade-delay')).toBe('100ms')
  })

  it('calls onOpen once the overlay and the delayed dialog have faded in', () => {
    vi.useFakeTimers()
    const onOpen = vi.fn()
    renderModal({ fadeDuration: 200, fadeDelay: 0.5, onOpen })

    act(() => vi.advanceTimersByTime(299))
    expect(onOpen).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('keeps the dialog mounted until the fade-out is over, then calls onAfterClose', () => {
    vi.useFakeTimers()
    const onAfterClose = vi.fn()
    const props = { onClose: () => {}, ariaLabel: 'Confirmation', fadeDuration: 200, onAfterClose }
    const { rerender } = render(<Modal isOpen {...props} />)

    rerender(<Modal isOpen={false} {...props} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(getBlocker()).not.toHaveClass('is-visible')

    act(() => vi.advanceTimersByTime(200))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(onAfterClose).toHaveBeenCalledTimes(1)
  })
})
